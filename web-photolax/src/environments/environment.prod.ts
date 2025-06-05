declare const process: {
  env: {
    [key: string]: string;
  }
};

export const environment = {
    production: true,
    apiUrl: 'https://photolax.onrender.com/api-photolax'
}; 