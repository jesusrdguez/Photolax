declare const process: {
  env: {
    [key: string]: string;
  }
};

export const environment = {
    production: true,
    apiUrl: process.env['API_URL'] || 'https://photolax.onrender.com/api-photolax'
}; 