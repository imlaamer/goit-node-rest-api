import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.status(200).json(result);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  //   console.log(params, id); //{ id: 'AeHIrLTr6JkxGE6SN-0Rw' } AeHIrLTr6JkxGE6SN-0Rw
  const result = await contactsService.getContactById(id);
  if (!result) {
    next();
    return;
  }
  res.status(200).json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    next();
    return;
  }
  res.status(200).json(result);
};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
