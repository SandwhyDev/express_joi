import express from "express";
import path from "path";
import { comparePassword, hashPassword } from "../libs/hashPassword";
import { signJwt, verifyJwt } from "../libs/jwt";
import uploadPhoto from "../libs/multer";
import validateStudentDetails from "../libs/validationPassword";
import userModel from "../model/userModel";
const userController = express.Router();

// CREATE
userController.post("/user/create", async (req, res) => {
  try {
    const { email, password } = await req.body;

    const validate = await validateStudentDetails(req.body);

    const findEmail = await userModel.findUnique({
      where: {
        email: email,
      },
    });

    if (findEmail) {
      res.status(401).json({
        success: false,
        msg: "email sudah digunakan",
      });
      return;
    }

    const createUser = await userModel.create({
      data: {
        email: email,
        password: hashPassword(password),
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil buat user",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// LOGIN
userController.post("/user/login", async (req, res) => {
  try {
    const { email, password } = await req.body;
    const cekEMail = await userModel.findUnique({
      where: {
        email: email,
      },
    });

    if (!cekEMail) {
      res.status(401).json({
        success: false,
        msg: "email salah",
      });
      return;
    }

    const cekPassword = await comparePassword(password, cekEMail.password);

    if (!cekPassword) {
      res.status(401).json({
        success: false,
        msg: "password salah",
      });
      return;
    }

    res.status(200).json({
      success: true,
      msg: "berhasil login",
      token: signJwt({
        app_name: "belajar lagi",
        email: cekEMail.email,
        id: cekEMail.id,
      }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//READ
userController.post("/user/read", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = await req.query;
    const skip = (page - 1) * limit;
    const cn = await userModel.count();
    const { filter } = await req.body;
    const result = await userModel.findMany({
      where: filter,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        avatar: {
          select: {
            filename: true,
          },
        },
      },
    });

    res.status(200).json({
      current_page: parseInt(page),
      total_page: Math.ceil(cn / limit),
      total_data: cn,
      total_data_tampilan: result.length,
      query: result,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//UPDATE
userController.put("/user/update/:id", verifyJwt, uploadPhoto.single("avatar"), async (req, res) => {
  try {
    const { id } = await req.params;
    const file = await req.file;
    const { email, password } = await req.body;

    const findId = await userModel.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!findId) {
      res.status(404).json({
        success: false,
        msg: "data tidak di temukan",
      });
      return;
    }

    const updateUser = await userModel.update({
      where: {
        id: parseInt(id),
      },
      data: {
        // email: email,
        password: hashPassword(password),
        avatar: {
          create: {
            filename: file.filename,
            location: path.join(__dirname, `../public/${file.filename}`),
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil update",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//  DELETE
userController.delete("/user/delete/:id", async (req, res) => {
  try {
    const { id } = await req.params;

    const findId = await userModel.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!findId) {
      res.status(404).json({
        success: false,
        msg: "user tidak ditemukan",
      });
      return;
    }

    const deleteUser = await userModel.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil delete",
    });
  } catch (error) {
    res.status(500).json({
      suucess: false,
      error: error.message,
    });
  }
});

export default userController;
