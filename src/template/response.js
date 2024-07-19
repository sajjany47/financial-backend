export const response = (data) => {
  const data = { message: "Data fetched successfully", data: data };
  return data;
};

export const datatable = (data, total) => {
  const data = {
    message: "Data fetched successfully",
    data: data,
    total: total,
  };
  return data;
};
