import { type User, type UpsertUser, type Client, type InsertClient, type Equipment, type InsertEquipment, type EquipmentCounter } from "@shared/schema";
import { users, clients, equipment, equipmentCounters } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
  
  // Equipment operations
  getEquipment(): Promise<Equipment[]>;
  getEquipmentByClient(clientId: string): Promise<Equipment[]>;
  getEquipmentItem(id: string): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: string, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: string): Promise<boolean>;
  
  // Equipment counter operations
  getEquipmentCounter(type: string): Promise<EquipmentCounter | undefined>;
  incrementEquipmentCounter(type: string): Promise<string>; // Returns next name like P0001, N0001
}

export class HybridStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private equipment: Map<string, Equipment>;
  private counters: Map<string, EquipmentCounter>;
  private useDatabase: boolean = false;
  private db: any = null;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.equipment = new Map();
    this.counters = new Map();
    
    // Initialize counters
    this.counters.set("computer", { type: "computer", counter: "0" });
    this.counters.set("ups", { type: "ups", counter: "0" });
    
    // Try to initialize database connection
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      if (process.env.DATABASE_URL) {
        const { db } = await import("./db");
        const { eq } = await import("drizzle-orm");
        
        // Test connection
        await db.select().from(users).limit(1);
        this.db = db;
        this.useDatabase = true;
        console.log("Database connection established, using Supabase");
        
        // Initialize counters in database
        await this.initializeDatabaseCounters();
      }
    } catch (error) {
      console.warn("Database connection failed, using in-memory storage:", error.message);
      this.useDatabase = false;
    }
  }

  private async initializeDatabaseCounters() {
    if (!this.useDatabase || !this.db) return;
    
    try {
      const { eq } = await import("drizzle-orm");
      
      // Check if counters exist, if not create them
      const computerCounter = await this.db.select().from(equipmentCounters).where(eq(equipmentCounters.type, "computer")).limit(1);
      if (computerCounter.length === 0) {
        await this.db.insert(equipmentCounters).values({ type: "computer", counter: "0" });
      }

      const upsCounter = await this.db.select().from(equipmentCounters).where(eq(equipmentCounters.type, "ups")).limit(1);
      if (upsCounter.length === 0) {
        await this.db.insert(equipmentCounters).values({ type: "ups", counter: "0" });
      }
    } catch (error) {
      console.error("Error initializing database counters:", error);
    }
  }

  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const userId = userData.id || randomUUID();
    const user: User = {
      id: userId,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: userData.role || "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.useDatabase && this.db) {
      try {
        const result = await this.db.insert(users).values(user).onConflictDoUpdate({
          target: users.id,
          set: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            role: userData.role || "user",
            updatedAt: new Date(),
          }
        }).returning();
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    
    this.users.set(user.id, user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const result = await this.db.select().from(users).where(eq(users.email, username)).limit(1);
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return Array.from(this.users.values()).find(user => user.email === username);
  }
  
  // Client operations
  async getClients(): Promise<Client[]> {
    if (this.useDatabase && this.db) {
      try {
        return await this.db.select().from(clients);
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return Array.from(this.clients.values());
  }
  
  async getClient(id: string): Promise<Client | undefined> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const result = await this.db.select().from(clients).where(eq(clients.id, id)).limit(1);
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return this.clients.get(id);
  }
  
  async createClient(clientData: InsertClient): Promise<Client> {
    const client: Client = {
      id: randomUUID(),
      name: clientData.name,
      description: clientData.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.useDatabase && this.db) {
      try {
        const result = await this.db.insert(clients).values(client).returning();
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    
    this.clients.set(client.id, client);
    return client;
  }
  
  async updateClient(id: string, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const result = await this.db.update(clients)
          .set({ ...clientData, updatedAt: new Date() })
          .where(eq(clients.id, id))
          .returning();
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    
    const existingClient = this.clients.get(id);
    if (!existingClient) return undefined;
    
    const updatedClient: Client = {
      ...existingClient,
      ...clientData,
      updatedAt: new Date(),
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  async deleteClient(id: string): Promise<boolean> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const result = await this.db.delete(clients).where(eq(clients.id, id)).returning();
        return result.length > 0;
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return this.clients.delete(id);
  }
  
  // Equipment operations
  async getEquipment(): Promise<Equipment[]> {
    if (this.useDatabase && this.db) {
      try {
        return await this.db.select().from(equipment);
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return Array.from(this.equipment.values());
  }
  
  async getEquipmentByClient(clientId: string): Promise<Equipment[]> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        return await this.db.select().from(equipment).where(eq(equipment.clientId, clientId));
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return Array.from(this.equipment.values()).filter(eq => eq.clientId === clientId);
  }
  
  async getEquipmentItem(id: string): Promise<Equipment | undefined> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const result = await this.db.select().from(equipment).where(eq(equipment.id, id)).limit(1);
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return this.equipment.get(id);
  }
  
  async createEquipment(equipmentData: InsertEquipment): Promise<Equipment> {
    const name = await this.incrementEquipmentCounter(equipmentData.type);
    const equipmentItem: Equipment = {
      id: randomUUID(),
      name,
      type: equipmentData.type,
      clientId: equipmentData.clientId,
      brand: equipmentData.brand,
      model: equipmentData.model,
      serialNumber: equipmentData.serialNumber,
      sector: equipmentData.sector,
      operator: equipmentData.operator || null,
      batteryDate: equipmentData.batteryDate ? new Date(equipmentData.batteryDate) : null,
      observations: equipmentData.observations || null,
      photoUrl: equipmentData.photoUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.useDatabase && this.db) {
      try {
        const result = await this.db.insert(equipment).values(equipmentItem).returning();
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    
    this.equipment.set(equipmentItem.id, equipmentItem);
    return equipmentItem;
  }
  
  async updateEquipment(id: string, equipmentData: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const updateData = {
          ...equipmentData,
          batteryDate: equipmentData.batteryDate ? new Date(equipmentData.batteryDate) : undefined,
          updatedAt: new Date(),
        };
        const result = await this.db.update(equipment)
          .set(updateData)
          .where(eq(equipment.id, id))
          .returning();
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    
    const existingEquipment = this.equipment.get(id);
    if (!existingEquipment) return undefined;
    
    const updatedEquipment: Equipment = {
      ...existingEquipment,
      ...equipmentData,
      batteryDate: equipmentData.batteryDate ? new Date(equipmentData.batteryDate) : existingEquipment.batteryDate,
      updatedAt: new Date(),
    };
    this.equipment.set(id, updatedEquipment);
    return updatedEquipment;
  }
  
  async deleteEquipment(id: string): Promise<boolean> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const result = await this.db.delete(equipment).where(eq(equipment.id, id)).returning();
        return result.length > 0;
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return this.equipment.delete(id);
  }
  
  // Equipment counter operations
  async getEquipmentCounter(type: string): Promise<EquipmentCounter | undefined> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        const result = await this.db.select().from(equipmentCounters).where(eq(equipmentCounters.type, type)).limit(1);
        return result[0];
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    return this.counters.get(type);
  }
  
  async incrementEquipmentCounter(type: string): Promise<string> {
    if (this.useDatabase && this.db) {
      try {
        const { eq } = await import("drizzle-orm");
        
        // Get current counter
        const counter = await this.getEquipmentCounter(type);
        if (!counter) {
          throw new Error(`Counter not found for type: ${type}`);
        }
        
        const currentCount = parseInt(counter.counter);
        const newCount = currentCount + 1;
        const newCountStr = newCount.toString();
        
        // Update counter
        await this.db.update(equipmentCounters)
          .set({ counter: newCountStr })
          .where(eq(equipmentCounters.type, type));
        
        // Generate name based on type
        const prefix = type === 'computer' ? 'P' : 'N';
        const paddedCount = newCount.toString().padStart(4, '0');
        return `${prefix}${paddedCount}`;
      } catch (error) {
        console.error("Database error, falling back to memory:", error);
      }
    }
    
    // Memory fallback
    const counter = this.counters.get(type);
    if (!counter) {
      throw new Error(`Counter not found for type: ${type}`);
    }
    
    const currentCount = parseInt(counter.counter);
    const newCount = currentCount + 1;
    const newCountStr = newCount.toString().padStart(4, '0');
    
    // Update counter
    this.counters.set(type, { ...counter, counter: newCount.toString() });
    
    // Generate name based on type
    const prefix = type === 'computer' ? 'P' : 'N';
    return `${prefix}${newCountStr}`;
  }
}

export const storage = new HybridStorage();

