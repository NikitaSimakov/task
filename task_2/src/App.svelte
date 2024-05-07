<script lang="ts">
  import { onMount } from 'svelte';

  let exchangeRate: number = 0;
  let exchangeCodes: any = null;
  let leftCurrency: string = 'RUB';
  let rightCurrency: string = 'USD';
  let amount: number | null = null;
  let convertedAmount: number | null = null;

  async function getCodes() {
    try {
      const response = await fetch('https://v6.exchangerate-api.com/v6/3af789763bd6255ec6460f07/codes');
      const { supported_codes } = await response.json();
      exchangeCodes = supported_codes;
    } catch (error) {
      console.error('Ошибка при получении списка валют:', error);
    }
  }

  async function fetchExchangeRate() {
    if (!leftCurrency || !rightCurrency) {
      console.log('Пожалуйста, заполните все поля');
      return;
    }
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/3af789763bd6255ec6460f07/pair/${leftCurrency}/${rightCurrency}`);
      const { conversion_rate } = await response.json();
      exchangeRate = conversion_rate;
      calculateConvertedAmount();
    } catch (error) {
      console.error('Ошибка при получении курса обмена:', error);
    }
  }

  function calculateConvertedAmount() {
    if (exchangeRate && amount) {
      convertedAmount = amount * exchangeRate;
    } else {
      convertedAmount = null;
    }
  }
  
  function handleConvertedAmountInput(event: any) {
    const value = event.target.value;
    if (!isNaN(value)) {
      convertedAmount = parseFloat(value);
      amount = convertedAmount / exchangeRate;
    } else {
      convertedAmount = null;
    }
  }

  onMount(() => {
    getCodes();
    fetchExchangeRate();
  });

</script>

<main>
  {#if exchangeCodes}
    <div class="container">
      <div class="row">
        <label for="amount">Вы потратите:</label>
        <input type="number" id="amount" min="10" max="10000" bind:value={amount} on:input={fetchExchangeRate} placeholder="10-10000">
        <select bind:value={leftCurrency} on:change={fetchExchangeRate}>
          {#each exchangeCodes as [code, name]}
            <option value={code}>{name}</option>
          {/each}
        </select>
      </div>

      <div class="row">
        <label for="convertedAmount">Вы получите:</label>
        <input type="number" id="convertedAmount" min="10" max="10000" bind:value={convertedAmount} on:input={handleConvertedAmountInput} placeholder="Введите сумму покупки">
        <select bind:value={rightCurrency} on:change={fetchExchangeRate}>
          {#each exchangeCodes as [code, name]}
            <option value={code}>{name}</option>
          {/each}
        </select>
      </div>
      <span>1 {rightCurrency} ≈ {(1 / exchangeRate).toFixed(3)} {leftCurrency}</span>
    </div>
  {:else}
    <p>Загрузка данных...</p>
  {/if}
</main>


<style>
  main {
    font-family: 'Roboto', sans-serif;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    background-color: #ffa5008f;
    border-radius: 15px;
  }

  label {
    font-size: 18px;
    margin-right: 10px;
    position: absolute;
    top: 10px;
    font-size: 12px;
    color: black;
  }

  input, select {
    width: 200px;
    height: 40px;
    font-size: 16px;
    margin: 0;
    background-color: #f3f5f7;
    border: none;
    color: #d9d9d9;
  }

  input {
    width: 280px;
    font-weight: bold;
    font-size: 1.4rem;
    color: black;
    outline: none;
  }

  input::placeholder {
    color: #d9d9d9;
  }

  select {
    color: black;
    height: 60px;
    border-radius: 10px;
    background-color: white;

    padding-left: 10px;
  }

  .container {
    background: white;
    padding: 50px;
    border-radius: 15px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    
  }
  
  .row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    background-color: #f3f5f7;
    height: 80px;
    position: relative;
    padding: 8px 8px 8px 16px;
    border-radius: 10px;

    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    align-content: center;
    column-gap: 10px;
  }
</style>