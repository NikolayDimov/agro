import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { CountryService } from "./country.service";
import { CreateCountryDto } from "./dtos/create-country.dto";
import { UpdateCountryDto } from "./dtos/update-country.dto";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("country")
@UseGuards(RolesGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createCountry")
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    try {
      return this.countryService.createCountry(createCountryDto);
    } catch (error) {
      console.error("Error creating country", error);
      return {
        message: "An error occurred while creating the country.",
        statusCode: 500,
      };
    }
  }

  @Get("getAllCountries")
  async getAllCountries() {
    try {
      return this.countryService.findAll();
    } catch (error) {
      console.error("Error fetching all countries:", error);
      throw new NotFoundException("Failed to fetch countries");
    }
  }

  @Get(":id")
  async getCountryById(@Param("id") id: string) {
    try {
      return this.countryService.findById(id);
    } catch (error) {
      console.error("Error fetching country by ID:", error);
      throw new NotFoundException("Country not found");
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateCountry(
    @Param("id") id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    try {
      return this.countryService.updateCountry(id, updateCountryDto);
    } catch (error) {
      console.error("Error updating country:", error);
      throw new NotFoundException("Failed to update country");
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteCountryById(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.countryService.deleteCountryById(id);
    } catch (error) {
      console.error("Error deleting country:", error);
      throw new NotFoundException("Failed to delete country");
    }
  }

  // For permanent delete accessible only by OWNER
  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteCountryByIdForOwner(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const userRole = UserRole.OWNER;

      return this.countryService.permanentlyDeleteCountryByIdForOwner(
        id,
        userRole,
      );
    } catch (error) {
      console.error("Error permanently deleting country:", error);
      throw new NotFoundException("Failed to permanently delete country");
    }
  }
}
