<template>
  <div class="h-dvh bg-gray-100 p-4 md:p-8">
    <h1 class="mb-4 text-2xl font-bold md:mb-6 md:text-4xl">
      Loan Repayment Calculator
    </h1>

    <div
      v-if="loadingState === LoadingStates.ERROR"
      class="text-center text-red-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mr-2 inline-block size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      An error has been encountered. Please try again later.
    </div>

    <LoanRepaymentLoader v-if="loadingState === LoadingStates.LOADING" />

    <div
      v-if="loadingState === LoadingStates.SUCCESS"
      class="space-y-6"
    >
      <LoanRepaymentAmountInput @loan-amount-change="onLoanAmountChange" />

      <div>
        <label
          for="loan-purposes"
          class="mb-2 block font-semibold text-gray-700"
        >Purpose of Loan</label>
        <div class="relative mt-1 shadow-sm">
          <select
            id="loan-purposes"
            v-model="selectedLoanPurposeAnnualRate"
            class="mt-1  block w-full appearance-none rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option
              v-for="item in loanPurposes"
              :key="item.value"
              :value="item.annualRate"
            >
              {{ item.label }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label
          for="loan-repayment"
          class="mb-2 block font-semibold text-gray-700"
        >Repayments Due</label>
        <div class="relative mt-1 shadow-sm">
          <select
            id="loan-repayment"
            v-model="selectedRepaymentPeriod"
            class="mt-1 block w-full appearance-none rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option
              v-for="item in requestedRepaymentPeriods"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label
          for="loan-term"
          class="mb-2 block font-semibold text-gray-700"
        >Loan Term</label>
        <div class="relative mt-1 shadow-sm">
          <select
            id="loan-term"
            v-model="selectedTermInMonths"
            class="mt-1 block w-full appearance-none rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option
              v-for="item in requestedTermMonths"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-4 shadow md:p-6">
        <p class="text-gray-600">
          Monthly Repayments:
        </p>
        <p class="text-xl font-semibold text-indigo-600 md:text-2xl">
          {{ monthlyRepaymentStr }}
        </p>

        <p class="mt-4 text-gray-600">
          Total Repayments:
        </p>
        <p class="text-lg font-semibold text-gray-800 md:text-xl">
          {{ totalRepaymentStr }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import API from '@/utils/api'
import PMT from '@/utils/PMT'
import formatAUD from '@/utils/format-aud'
import LoanRepaymentAmountInput from './loan-repayment-amount-input.vue'
import LoanRepaymentLoader from './loan-repayment-loader.vue'

// status
const LoadingStates = {
  LOADING: 0,
  ERROR: 1,
  SUCCESS: 2,
}
const loadingState = ref(LoadingStates.LOADING)

// data
const loanAmount = ref(null)
const loanPurposes = ref(null)
const requestedRepaymentPeriods = ref(null)
const requestedTermMonths = ref(null)
const monthlyRepayment = ref(null)
const totalRepayment = ref(null)

// v-models
const selectedLoanPurposeAnnualRate = ref(null)
const selectedRepaymentPeriod = ref(null)
const selectedTermInMonths = ref(null)

const monthlyRepaymentStr = computed(() => {
  if (!monthlyRepayment.value) return '-'
  return formatAUD(monthlyRepayment.value, true)
})

const totalRepaymentStr = computed(() => {
  if (!totalRepayment.value) return '-'
  return formatAUD(totalRepayment.value, true)
})

watch(
  [loanAmount, selectedLoanPurposeAnnualRate, selectedRepaymentPeriod, selectedTermInMonths],
  async ([newLoanAmount, newLoanPurposeAnnualRate, newRepaymentPeriod]) => {
    if (!newLoanAmount) {
      monthlyRepayment.value = null
      totalRepayment.value = null
      return
    }

    const result = PMT(
      newLoanPurposeAnnualRate / newRepaymentPeriod,
      nper.value,
      newLoanAmount
    )

    // result negative as it is a repayment (outflow)
    monthlyRepayment.value = -result
    totalRepayment.value = -result * nper.value
  }, { immediate: false }
)

// compute nper
const nper = computed(() => {
  if (selectedRepaymentPeriod.value === 12) {
    return selectedTermInMonths.value
  }
  return (selectedTermInMonths.value / 12) * selectedRepaymentPeriod.value
})

async function fetchAllData () {
  try {
    [loanPurposes.value, requestedRepaymentPeriods.value, requestedTermMonths.value] = await Promise.all([
      API.getLoanPurposes(),
      API.getRequestedRepaymentPeriods(),
      API.getRequestedTermMonths(),
    ])
    loadingState.value = LoadingStates.SUCCESS
  } catch (error) {
    loadingState.value = LoadingStates.ERROR
  }
}

function onLoanAmountChange (newLoanAmountStr) {
  loanAmount.value = !newLoanAmountStr ? '' : parseInt(newLoanAmountStr, 10)
}

onMounted(async () => {
  await fetchAllData()

  // set selection defaults
  // we could update the BE response with new option props isDefault: bool or; placeholder: string
  selectedTermInMonths.value = requestedTermMonths.value[0].value
  selectedRepaymentPeriod.value = requestedRepaymentPeriods.value[0].value
  selectedLoanPurposeAnnualRate.value = loanPurposes.value[0].annualRate
})

</script>
