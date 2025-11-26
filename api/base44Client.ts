// Mock API Client to simulate backend behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class EntityClient {
  private entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  private getStorageKey() {
    return `base44_${this.entityName}`;
  }

  private getData(): any[] {
    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  private saveData(data: any[]) {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  }

  // Helper to get current user from session
  private getCurrentUser(): { id: string, nome: string } | null {
    try {
      const session = localStorage.getItem('base44_session');
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  }

  async list(sort?: string, limit?: number) {
    await delay(300);
    let data = this.getData();
    
    // Auto-fix: Ensure all items have IDs (handles legacy data)
    let modified = false;
    data = data.map(item => {
      if (!item.id) {
        modified = true;
        return { ...item, id: Math.random().toString(36).substring(2, 11) };
      }
      return item;
    });
    if (modified) {
      this.saveData(data);
    }

    // Simple mock sorting (assumes sort string is like '-created_date')
    if (sort) {
      const desc = sort.startsWith('-');
      const key = desc ? sort.substring(1) : sort;
      data.sort((a, b) => {
        // Handle undefined values
        const valA = a[key] || '';
        const valB = b[key] || '';
        if (valA < valB) return desc ? 1 : -1;
        if (valA > valB) return desc ? -1 : 1;
        return 0;
      });
    }
    if (limit && limit > 0) {
      data = data.slice(0, limit);
    }
    return data;
  }

  async create(data: any) {
    await delay(300);
    const list = this.getData();
    const currentUser = this.getCurrentUser();

    const newItem = { 
      ...data, 
      id: Math.random().toString(36).substring(2, 11),
      created_date: new Date().toISOString(),
      // Automagically track who created this record
      registrado_por: currentUser ? currentUser.nome : 'Sistema',
      registrado_por_id: currentUser ? currentUser.id : null
    };
    list.unshift(newItem);
    this.saveData(list);
    return newItem;
  }

  async update(id: string, data: any) {
    await delay(300);
    const list = this.getData();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      this.saveData(list);
      return list[index];
    }
    throw new Error('Entity not found');
  }

  async delete(id: string) {
    await delay(300);
    const list = this.getData();
    const newList = list.filter(item => item.id !== id);
    this.saveData(newList);
    return { success: true };
  }
}

export const base44 = {
  auth: {
    // Check if a shift is active
    getSession: () => {
      try {
        const session = localStorage.getItem('base44_session');
        return session ? JSON.parse(session) : null;
      } catch (e) {
        return null;
      }
    },
    // Start a shift (Login)
    login: async (funcionarioId: string, funcionarioNome: string) => {
      await delay(200);
      const session = {
        id: funcionarioId,
        nome: funcionarioNome,
        inicio_turno: new Date().toISOString()
      };
      localStorage.setItem('base44_session', JSON.stringify(session));
      return session;
    },
    // End a shift (Logout)
    logout: async () => {
      await delay(200);
      localStorage.removeItem('base44_session');
      // No reload here, UI handles state update
    },
    // Legacy compatibility
    me: async () => {
      await delay(100);
      const session = localStorage.getItem('base44_session');
      if (session) {
        const s = JSON.parse(session);
        return { full_name: s.nome, email: 'Operador Ativo' };
      }
      return null; // Return null if no session
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }: { file: File }) => {
        await delay(1000);
        // Return a fake URL or create a blob URL
        return { file_url: URL.createObjectURL(file) };
      }
    }
  },
  entities: {
    Encomenda: new EntityClient('Encomenda'),
    Ocorrencia: new EntityClient('Ocorrencia'),
    Funcionario: new EntityClient('Funcionario'),
    RegistroPonto: new EntityClient('RegistroPonto'),
    Morador: new EntityClient('Morador'),
    ItemRecebido: new EntityClient('ItemRecebido'),
    Entregador: new EntityClient('Entregador'),
    VisitaEntregador: new EntityClient('VisitaEntregador'),
    Empresa: new EntityClient('Empresa'),
    MaterialEmprestado: new EntityClient('MaterialEmprestado'),
    Visitante: new EntityClient('Visitante')
  }
};