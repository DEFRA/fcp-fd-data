import { Sequelize, DataTypes } from 'sequelize'
import defineCommsEvent from './commsEvent.js'

// Initialize Sequelize
const sequelize = new Sequelize('postgres://postgres:ppp@localhost:5033/fcp_fd_data', {
  dialect: 'postgres',
  logging: false
})

// Define the commsEvent model
const commsEvent = defineCommsEvent(sequelize)

const runTest = async () => {
  try {
    // Synchronize the model with the database
    await sequelize.sync({ force: true })

    // Create a new commsEvent record
    const newEvent = await commsEvent.create({
      ID: '12345678-1234-1234-1234-123456789012',
      dateCreated: new Date(),
      commsMessage: { message: 'Hello, World!' }
    })

    console.log('New commsEvent created:', newEvent.toJSON())

    // Fetch the record from the database
    const fetchedEvent = await commsEvent.findByPk('12345678-1234-1234-1234-123456789012')
    console.log('Fetched commsEvent:', fetchedEvent.toJSON())
  } catch (error) {
    console.error('Error:', error)
  } finally {
    // Close the database connection
    await sequelize.close()
  }
}

runTest()