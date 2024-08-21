// make signup controller
export const signup = async (req, res) => {
  res.json({
    data: 'hai dari server',
  });
};

// make login controller
export const login = async (req, res) => {
  res.send('login controller');
};

// make logout controller
export const logout = async (req, res) => {
  res.send('logout controller');
};
