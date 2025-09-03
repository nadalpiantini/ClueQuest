async function globalTeardown() {
  console.log('🏁 ClueQuest E2E Testing Complete');
  console.log('📊 Check playwright-report/index.html for detailed results');
  console.log('🔍 Failed test screenshots and videos available in test-results/');
}

export default globalTeardown;