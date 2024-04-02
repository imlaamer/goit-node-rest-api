import Contact from "../models/Contact.js";

export const getAll = async (filter = {}, page, limit) => {
  const result = await Contact.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);
  return result;
};

export const getContactById = (id) => Contact.findById(id);

export const addContact = (data) => Contact.create(data);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const removeContactById = (id) => Contact.findByIdAndDelete(id);

export const updateStatusById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);
