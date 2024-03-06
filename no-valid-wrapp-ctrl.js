export const createContact = async (req, res, next) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  //
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

export const updateContact = async (req, res, next) => {
  const { error, value } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  // if (Object.keys(value).length === 0) {
  //   throw HttpError(400, "Body must have at least one field");
  // }

  //
  const { id } = req.params;
  const result = await contactsService.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};
