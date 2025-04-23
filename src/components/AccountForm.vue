<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAccountStore, type Account } from '../stores/account';
import { useLabels } from '../composables/useLabels';

const store = useAccountStore();
const { parseLabels, getLabelsAsString } = useLabels();

const accountTypes = ref([
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'Local' }
]);

const accounts = computed(() => store.accounts);

const touchedFields = ref(new Set<string>());

const useValidation = () => {
  const validateAccount = (account: Account) => {
    const errors = new Set<string>();
    
    if (!account.login?.trim()) {
      errors.add('login');
    }
    if (account.accountType === 'Local' && !account.password?.trim()) {
      errors.add('password');
    }
    
    return errors;
  };

  return {
    validateAccount
  };
};

const { validateAccount } = useValidation();

const handleInputBlur = (account: Account, field: keyof Account) => {
  touchedFields.value.add(`${account.id}-${field}`);
  
  if (field === 'labelInput') {
    account.label = parseLabels(account.labelInput || '');
  }
  
  if (touchedFields.value.has(`${account.id}-${field}`)) {
    const errors = validateAccount(account);
    if (errors.has('login')) {
      return;
    }
  }
  
  store.updateAccount(account);
};

const handleAccountTypeChange = (account: Account) => {
  account.password = account.accountType === 'LDAP' ? null : '';
  store.updateAccount(account);
};

const isFieldInvalid = (account: Account, field: string) => {
  if (!touchedFields.value.has(`${account.id}-${field}`)) {
    return false;
  }
  return validateAccount(account).has(field);
};
</script>

<template>
  <div class="account-manager">
    <div class="header">
      <h1>Учетные записи</h1>
      <Button 
        label="Добавить новую учетную запись" 
        icon="pi pi-plus" 
        @click="store.addAccount"
        class="add-account-btn"
      />
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
        <tbody v-if="accounts?.length">
          <tr v-for="account in accounts" :key="account.id">
            <td>
              <FloatLabel>
                <InputText
                    :value="account.labelInput ?? getLabelsAsString(account.label)"
                    maxlength="50"
                    @blur="handleInputBlur(account, 'labelInput')"
                    class="label-input"
                />
                <label>Введите метки</label>
              </FloatLabel>
            </td>
            <td>
              <Dropdown
                v-model="account.accountType"
                :options="accountTypes"
                optionLabel="label"
                optionValue="value"
                @change="handleAccountTypeChange(account)"
                class="account-type-dropdown"
              />
            </td>
            <td>
              <FloatLabel>
                <InputText
                  v-model="account.login"
                  maxlength="100"
                  :class="{ 'invalid': isFieldInvalid(account, 'login') }"
                  @blur="handleInputBlur(account, 'login')"
                  class="login-input"
                />
                <label>Введите логин</label>
              </FloatLabel>
            </td>
            <td>
              <FloatLabel v-if="account.accountType === 'Local'">
                <Password
                  v-model="account.password"
                  maxlength="100"
                  :class="{ 'invalid': isFieldInvalid(account, 'password') }"
                  @blur="handleInputBlur(account, 'password')"
                  toggleMask
                  class="password-input"
                />
                <label>Введите пароль</label>
              </FloatLabel>
              <span v-else class="disabled-field">Не требуется</span>
            </td>
            <td>
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="store.deleteAccount(account.id)"
                class="delete-btn"
              />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" class="empty-message">
              Список учетных записей пуст
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
  color: var(--text-color);
}

.account-table {
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: var(--surface-hover);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-color);
}

td {
  color: var(--text-color);
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

tr:last-child td {
  border-bottom: none;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-password) {
  width: 100%;
}

.invalid {
  border-color: var(--red-500) !important;
}

.disabled-field {
  color: var(--text-color-secondary);
  font-style: italic;
}

.add-account-btn {
  min-width: 200px;
}

.empty-message {
  text-align: center;
  color: var(--text-color-secondary);
  font-style: italic;
  padding: 2rem !important;
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
    padding: 1rem;
    
    &:before {
      content: attr(data-label);
      font-weight: 600;
      display: block;
      margin-bottom: 0.5rem;
    }
  }

  tr:last-child {
    border-bottom: none;
  }
  
  tr {
    display: block;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--surface-border);
  }
}

:deep(.p-float-label) {
  width: 100%;
}

:deep(.p-float-label input:focus) ~ label,
:deep(.p-float-label input.p-filled) ~ label,
:deep(.p-float-label textarea:focus) ~ label,
:deep(.p-float-label textarea.p-filled) ~ label,
:deep(.p-float-label .p-inputwrapper-focus) ~ label,
:deep(.p-float-label .p-inputwrapper-filled) ~ label {
  color: var(--primary-color);
}

:deep(.p-float-label input.invalid:focus) ~ label,
:deep(.p-float-label input.invalid.p-filled) ~ label {
  color: var(--red-500);
}
</style>