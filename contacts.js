const fs = require("fs").promises;
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    console.table(contacts);
    return contacts;
  } catch (err) {
    console.error("Error loading contacts:".red, err.message);
    return [];
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    const contact = contacts.find((contact) => contact.id === contactId);
    if (!contact) {
      console.error(`Contact with ID ${contactId} not found.`.yellow);
      return null;
    }
    console.table(contact);
    return contact;
  } catch (err) {
    console.error("Error fetching contact by ID:".red, err.message);
    return null;
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );

    if (contacts.length === filteredContacts.length) {
      console.warn(`Contact with ID ${contactId} not found.`.yellow);
      return false;
    }

    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
    console.log(`Contact with ID ${contactId} has been removed.`.green);
    return true;
  } catch (err) {
    console.error("Error removing contact:".red, err.message);
    return false;
  }
};

const addContact = async (name, email, phone) => {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);

    const isDuplicate = contacts.some(
      (contact) => contact.email === email || contact.phone === phone
    );

    if (isDuplicate) {
      console.log(
        `Contact with email: ${email} or phone: ${phone} already exists!`.yellow
      );
      return null;
    }

    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(`Contact with name: ${name} has been added.`.green);
    return newContact;
  } catch (err) {
    console.error("Error adding contact:".red, err.message);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
