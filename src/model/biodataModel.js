import { PrismaClient } from "@prisma/client";

const biodataModel = new PrismaClient().biodata;

export default biodataModel;
