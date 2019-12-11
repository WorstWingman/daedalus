const faker = require('faker');
const fs = require('fs');
const path = require('path');
const BigNumber = require('bignumber.js');

function generatStakePoolsFakeData() {
  const stakePools = [];
  for (let i = 1; i <= 300; i++) {
    const controlledStake = faker.random.number(100);
    const cost = new BigNumber(faker.random.number(100));
    const createdAt = faker.date.recent();
    const description = faker.lorem.words();
    const homepage = faker.internet.url();
    const id = faker.random.alphaNumeric(64);
    const isCharity = faker.random.boolean();
    const name = faker.name.findName();
    const performance = faker.random.number(100);
    const pledge = new BigNumber(faker.random.number(100));
    const pledgeAddress = faker.internet.url();
    const producedBlocks = faker.random.number(100);
    const profitMargin = faker.random.number(100);
    const ranking = i;
    const retiring = null;
    const ticker = faker.helpers.replaceSymbols('????');
    stakePools.push({
      controlledStake,
      cost,
      createdAt,
      description,
      homepage,
      id,
      isCharity,
      name,
      performance,
      pledge,
      pledgeAddress,
      producedBlocks,
      profitMargin,
      ranking,
      retiring,
      ticker,
    });
  }
  return stakePools;
}

const fakeStakePools = generatStakePoolsFakeData();
fs.writeFileSync(
  `${path.join(__dirname, '/')}stakingStakePools.dummy.json`,
  JSON.stringify(fakeStakePools, null, '\t')
);