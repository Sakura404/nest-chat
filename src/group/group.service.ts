import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly GroupRepository: Repository<Group>,
  ) {}

  create(createGroupDto: CreateGroupDto) {
    return 'This action adds a new group';
  }

  findAll() {
    return `This action returns all group`;
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
  async findGroupByLikeName(name: string) {
    const Groups = await this.GroupRepository.find({
      where: { groupName: Like(`%${name}%`) },
    });
    if (Groups.length == 0) {
      throw new NotFoundException('找不到该群名');
    }
    return Groups;
  }
}
