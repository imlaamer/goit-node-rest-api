import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function getContacts() {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
} // для чого повертати розпарсений код?
// app.use(express.json()); - це для іншого походу для чого ?

async function updateContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}
//

export async function listContacts() {
  const contacts = await getContacts();
  return contacts;
}

export async function getContactById(contactId) {
  const contacts = await getContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
} // +

export async function removeContact(contactId) {
  const contacts = await getContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (contactIndex === -1) return null;
  const [contact] = contacts.splice(contactIndex, 1);
  await updateContacts(contacts);
  return contact;
}

export async function addContact(data) {
  const contacts = await getContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}
