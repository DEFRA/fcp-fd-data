import { Sequelize } from 'sequelize'
import defineCommsEvent from './commsEvent.js'
import commsEventValidation from '../../events/commsEvent/schema.js'

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

    // Define the data to be validated and inserted
    const commsEventData1 = {
      id: '44925853-76f7-435f-adb9-158af77e9f01',
      dateCreated: new Date(),
      commsMessage: { message: 'Hello, World!' }
    }

    const commsEventData2 = {
      id: '0140aff4-8f2f-435b-b180-7f5a4b860fcb',
      dateCreated: new Date(),
      commsMessage: { message: 'Hello, World!' }
    }

    // Validate the data
    const { error: error1, value: validData1 } = commsEventValidation.validate(commsEventData1)
    const { error: error2, value: validData2 } = commsEventValidation.validate(commsEventData2)

    if (error1) {
      console.error('Validation error for commsEventData1:', error1.details)
    } else {
      // Create a new commsEvent record
      const newEvent1 = await commsEvent.create(validData1)
      console.log('New commsEvent created:', newEvent1.toJSON())
    }

    if (error2) {
      console.error('Validation error for commsEventData2:', error2.details)
    } else {
      // Create a new commsEvent record
      const newEvent2 = await commsEvent.create(validData2)
      console.log('New commsEvent created:', newEvent2.toJSON())
    }

    // Fetch the record from the database
    const fetchedEvent = await commsEvent.findByPk('44925853-76f7-435f-adb9-158af77e9f01')
    console.log('Fetched commsEvent:', fetchedEvent.toJSON())
  } catch (error) {
    console.error('Error:', error)
  } finally {
    // Close the database connection
    await sequelize.close()
  }
}

runTest()
