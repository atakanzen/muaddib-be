import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UsePipes,
} from '@nestjs/common';
import { DecisionTreePipe } from './decision-tree.pipe';
import { DecisionTreeService } from './decision-tree.service';
import { CreateDecisionTreeDTO } from './dto/create-decision-trees.dto';
import { ListDecisionTreesDTO } from './dto/list-decision-trees.dto';
import { UpdateDecisionTreeDTO } from './dto/update-decision-tree.dto';

@Controller('decision-tree')
export class DecisionTreeController {
    constructor(private service: DecisionTreeService) {}

    @HttpCode(HttpStatus.OK)
    @Get('get/:treeId')
    async getDecisionTree(
        @Param('treeId', ParseUUIDPipe) treeId: string,
        @AuthUser() user: AuthUser,
    ) {
        return await this.service.get({
            userId: user.sub,
            treeId: treeId,
        });
    }

    @HttpCode(HttpStatus.OK)
    @Get('list')
    async listDecisionTrees(
        @Query() dto: ListDecisionTreesDTO,
        @AuthUser() user: AuthUser,
    ) {
        return await this.service.list({
            userId: user.sub,
            skip: dto.skip,
            take: dto.take,
        });
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    @UsePipes(new DecisionTreePipe({ required: true }))
    async createDecisionTree(
        @Body() dto: CreateDecisionTreeDTO,
        @AuthUser() user: AuthUser,
    ) {
        return await this.service.insert({
            userId: user.sub,
            ...dto,
        });
    }

    @HttpCode(HttpStatus.OK)
    @Patch('update/:treeId')
    @UsePipes(new DecisionTreePipe({ required: false }))
    async updateDecisionTree(
        @Param('treeId', ParseUUIDPipe) treeId: string,
        @Body() dto: UpdateDecisionTreeDTO,
        @AuthUser() user: AuthUser,
    ) {
        await this.service.update({
            userId: user.sub,
            treeId: treeId,
            values: dto,
        });
    }

    @HttpCode(HttpStatus.OK)
    @Delete('delete/:treeId')
    async deleteDecisionTree(
        @Param('treeId', ParseUUIDPipe) treeId: string,
        @AuthUser() user: AuthUser,
    ) {
        await this.service.delete({
            userId: user.sub,
            treeId: treeId,
        });
    }
}
