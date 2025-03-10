<template>
  <div>
    <label
      for="loan-amount"
      class="mb-2 block font-semibold text-gray-700"
    >Loan Amount</label>
    <small class="block pb-1">
      How much would you like to borrow? {{ formatAUD(minLoanAmount) }} - {{ formatAUD(maxLoanAmount) }}
    </small>
    <div class="relative mt-1 rounded-md shadow-sm">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span class="text-gray-500 sm:text-sm">$</span>
      </div>
      <input
        id="loan-amount"
        ref="inputRef"
        v-model="inputValue"
        autocomplete="off"
        type="text"
        placeholder="0"
        class="block w-full rounded-md border-gray-300 py-2 pl-7 pr-2 focus:border-indigo-500 focus:ring-indigo-500"
        @input="onInput"
        @keydown="onKeyDown"
        @change="onChange"
      >
      <button
        v-if="inputValue"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        type="button"
        title="Clear"
        @click="clearInput"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5 text-gray-400 hover:text-gray-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <p
      v-if="errorMessage"
      class="mt-2 text-sm text-red-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits, nextTick } from 'vue'
import formatAUD from '@/utils/format-aud'

const initialLoanAmount = 30000
const maxLoanAmount = 20000000
const minLoanAmount = 1000

const inputRef = ref(null)
const inputValue = ref(initialLoanAmount.toString())
const errorMessage = ref('')

const emit = defineEmits(['loan-amount-change'])

function onInput (event) {
  // only allow digits
  const newValue = event.target.value.replace(/[^0-9]/g, '') // remove !digits
  inputValue.value = newValue
  if (validateInput()) {
    emit('loan-amount-change', newValue)
  } else {
    emit('loan-amount-change', null)
  }
}

function onKeyDown (event) {
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
  ]

  // allow ctrl+c, ctrl+v etc
  const controlKeys = ['a', 'c', 'v', 'x']
  if (
    !allowedKeys.includes(event.key) &&
    !(event.ctrlKey || event.metaKey) && // allow ctrl/cmd + controlKeys
    !(controlKeys.includes(event.key.toLowerCase()) && (event.ctrlKey || event.metaKey)) &&
    !/^[0-9]$/.test(event.key) // only allow digits
  ) {
    event.preventDefault()
  }
}

/**
 * returns validation result and handles error messages
 *
 * @returns {boolean}
 */
function validateInput () {
  errorMessage.value = ''

  if (inputValue.value === '') {
    return false
  }

  const numValue = parseInt(inputValue.value, 10)

  if (isNaN(numValue)) {
    errorMessage.value = 'Invalid number format.'
    return false
  }

  if (numValue < minLoanAmount) {
    errorMessage.value = `The borrowed amount must be at least ${formatAUD(minLoanAmount)}.`
    return false
  } else if (numValue > maxLoanAmount) {
    errorMessage.value = `The borrowed amount must be no more than ${formatAUD(maxLoanAmount)}.`
    return false
  }

  return true
}

function clearInput () {
  inputValue.value = ''
  inputRef.value.focus()
  nextTick(() => {
    inputRef.value.dispatchEvent(new Event('input'))
  })
}

watch(inputValue, validateInput)

onMounted(() => {
  inputRef.value.focus()
  emit('loan-amount-change', inputValue.value)
})

</script>

<style scoped>
.error {
  color: red;
}
</style>
