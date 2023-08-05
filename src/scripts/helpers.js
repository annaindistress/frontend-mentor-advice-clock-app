export const getJSON = async url => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(`Something went wrong (${response.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};
