<script setup lang="ts">
import { useAccountStore, type Account } from '../stores/account';

const store = useAccountStore();

const accountTypes = [
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'Local' }
];

const validateAccount = (account: Account) => {
  const errors = new Set<string>();
  
  if (!account.login.trim()) {
    errors.add('login');
  }
  if (account.accountType === 'Local' && !account.password?.trim()) {
    errors.add('password');
  }
  
  return errors;
};

const getLabelsAsString = (labels: { text: string }[]) => {
  return labels.map(label => label.text).join(';') || '';
};

const handleInputBlur = (account: Account, field: keyof Account) => {
  if (field === 'labelInput') {
    account.label = store.parseLabels(account.labelInput || '');
  }
  store.updateAccount(account);
};

const handleAccountTypeChange = (account: Account) => {
  if (account.accountType === 'LDAP') {
    account.password = null;
  } else {
    account.password = '';
  }
  store.updateAccount(account);
};
</script>

<template>
  <div class="account-manager">
    <div class="header">
      <h1>Учетные записи</h1>
      <Button label="Добавить новую учетную запись" icon="pi pi-plus" @click="store.addAccount" />
    </div>

    <div class="account-table">
      <table>
        <thead>
          <tr>
            <th>Метки</th>
            <th>Тип записи</th>
            <th>Логин</th>
            <th>Пароль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in store.accounts" :key="account.id">
            <td>
              <InputText
                v-model="account.labelInput"
                :modelValue="getLabelsAsString(account.label)"
                maxlength="50"
                placeholder="Введите метки"
                @blur="handleInputBlur(account, 'labelInput')"
              />
            </td>
            <td>
              <Dropdown
                v-model="account.accountType"
                :options="accountTypes"
                optionLabel="label"
                optionValue="value"
                @change="handleAccountTypeChange(account)"
              />
            </td>
            <td>
              <InputText
                v-model="account.login"
                maxlength="100"
                placeholder="Введите логин"
                :class="{ 'invalid': validateAccount(account).has('login') }"
                @blur="handleInputBlur(account, 'login')"
              />
            </td>
            <td>
              <Password
                v-if="account.accountType === 'Local'"
                v-model="account.password"
                maxlength="100"
                placeholder="Введите пароль"
                :class="{ 'invalid': validateAccount(account).has('password') }"
                @blur="handleInputBlur(account, 'password')"
                toggleMask
              />
              <span v-else class="disabled-field">Не требуется</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.account-manager {
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
  color: #495057;
}

.account-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

tr:last-child td {
  border-bottom: none;
}

:deep(.p-inputtext),
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-password) {
  width: 100%;
}

.invalid {
  border-color: #dc3545 !important;
}

.disabled-field {
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .account-manager {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  th {
    display: none;
  }
  
  td {
    display: block;
    padding: 0.5rem 1rem;
    
    &:before {
      content: attr(data-label);
      font-weight: 600;
      display: block;
      margin-bottom: 0.5rem;
    }
  }
  
  tr {
    display: block;
    margin-bottom: 1rem;
    border-bottom: 2px solid #dee2e6;
  }
}
</style>