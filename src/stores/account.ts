import { defineStore } from 'pinia';

export interface Label {
  text: string;
}

export interface Account {
  id: string;
  label: Label[];
  labelInput?: string;
  accountType: 'LDAP' | 'Local';
  login: string;
  password: string | null;
}

export const useAccountStore = defineStore('account', {
  state: () => ({
    accounts: [] as Account[]
  }),
  
  getters: {
    getAccountById: (state) => {
      return (id: string) => state.accounts.find(account => account.id === id);
    },
    
    getLocalAccounts: (state) => {
      return state.accounts.filter(account => account.accountType === 'Local');
    },
    
    getLdapAccounts: (state) => {
      return state.accounts.filter(account => account.accountType === 'LDAP');
    }
  },
  
  actions: {
    addAccount() {
      const newAccount: Account = {
        id: crypto.randomUUID(),
        label: [],
        labelInput: '',
        accountType: 'Local',
        login: '',
        password: ''
      };
      this.accounts.push(newAccount);
    },

    updateAccount(account: Account) {
      const index = this.accounts.findIndex(a => a.id === account.id);
      if (index !== -1) {
        this.accounts[index] = account;
      }
    },

    deleteAccount(id: string) {
      const index = this.accounts.findIndex(a => a.id === id);
      if (index !== -1) {
        this.accounts.splice(index, 1);
      }
    }
  },

  persist: true
});