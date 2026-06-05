import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'El nombre de usuario ya está en uso'
    },
    validate: {
      notEmpty: { msg: 'El nombre de usuario no puede estar vacío' },
      len: {
        args: [3, 30],
        msg: 'El nombre de usuario debe tener entre 3 y 30 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'El correo electrónico ya está registrado'
    },
    validate: {
      isEmail: { msg: 'Debe proporcionar un correo electrónico válido' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'staff'),
    defaultValue: 'staff',
    allowNull: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método de instancia para verificar contraseña
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default User;
