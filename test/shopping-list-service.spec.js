const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe('Shopping List Service object', function() {
    let db
    let testItems = [
        {
            id: 1,
            name: 'First test item!',
            price: '6.00',
            date_added: new Date('2020-01-22T16:28:32.615Z'),
            category: 'Main'
        },
        {
            id: 2,
            name: 'Second test item!',
            price: '12.00',
            date_added: new Date('2020-01-22T16:28:32.615Z'),
            category: 'Main'
        },
        {
            id: 3,
            name: 'Third test item!',
            price: '21.00',
            date_added: new Date('2020-01-22T16:28:32.615Z'),
            category: 'Main'
        },
        {
            id: 4,
            name: 'Fourth test item!',
            price: '4.00',
            date_added: new Date('2020-01-22T16:28:32.615Z'),
            category: 'Main'
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        before(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            const expectedItems = testItems.map(item => ({
                ...item,
                checked: false,
            }))
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(expectedItems)
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new name',
                price: '99.00',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                category: 'Breakfast',
                checked: true
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        category: newItem.category,
                        checked: newItem.checked
                    })
                })
        })
    })
})