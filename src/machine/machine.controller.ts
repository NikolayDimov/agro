import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateMachineDto } from "./dtos/create-machine.dto";
import { MachineService } from "./machine.service";
import { UpdateMachineDto } from "./dtos/update-machine.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("machine")
@UseGuards(RolesGuard)
export class MachineController {
  constructor(private machineService: MachineService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createMachine")
  async createMachine(@Body() createMachineDto: CreateMachineDto) {
    try {
      return this.machineService.createMachine(createMachineDto);
    } catch (error) {
      console.error("Error creating machine:", error);
      return { success: false, message: error.message };
    }
  }

  @Get("getAll")
  async getAllMachines() {
    try {
      const machines = await this.machineService.findAll();
      return { data: machines };
    } catch (error) {
      console.error("Error fetching all machines:", error);
      return { success: false, message: error.message };
    }
  }

  @Get(":id")
  async getMachineById(@Param("id", ParseUUIDPipe) id: string) {
    try {
      const machine = await this.machineService.findById(id);
      if (!machine) {
        throw new NotFoundException("Machine not found");
      }

      return { data: machine };
    } catch (error) {
      console.error("Error fetching machine by ID:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateMachine(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    try {
      return this.machineService.updateMachine(id, updateMachineDto);
    } catch (error) {
      console.error("Error updating machine:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteMachineById(@Param("id", ParseUUIDPipe) id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    try {
      return this.machineService.deleteMachineById(id);
    } catch (error) {
      console.error("Error deleting machine:", error);
      throw new NotFoundException("Failed to delete machine");
    }
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteMachineByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    try {
      const userRole = UserRole.OWNER;

      return this.machineService.permanentlyDeleteMachineByIdForOwner(
        id,
        userRole,
      );
    } catch (error) {
      console.error("Error permanently deleting machine:", error);
      throw new NotFoundException("Failed to permanently delete machine");
    }
  }
}

// When you use return with a promise inside an asynchronous function, the function automatically returns a promise that will be resolved with the value returned from the asynchronous operation. Here's the corrected explanation:
