import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AutoGenerate1711937723499 implements MigrationInterface {
  name = 'AutoGenerate1711937723499'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `tag` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_6a9775008add570dc3e5a0bab7` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB')
    await queryRunner.query('CREATE TABLE `post` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, `content` text NOT NULL, `visible` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    await queryRunner.query('CREATE TABLE `user` (`id` varchar(36) NOT NULL, `email` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB')
    await queryRunner.query('CREATE TABLE `post_tags_tag` (`postId` varchar(36) NOT NULL, `tagId` varchar(36) NOT NULL, INDEX `IDX_b651178cc41334544a7a9601c4` (`postId`), INDEX `IDX_41e7626b9cc03c5c65812ae55e` (`tagId`), PRIMARY KEY (`postId`, `tagId`)) ENGINE=InnoDB')
    await queryRunner.query('ALTER TABLE `post` ADD CONSTRAINT `FK_5c1cf55c308037b5aca1038a131` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION')
    await queryRunner.query('ALTER TABLE `post_tags_tag` ADD CONSTRAINT `FK_b651178cc41334544a7a9601c45` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE')
    await queryRunner.query('ALTER TABLE `post_tags_tag` ADD CONSTRAINT `FK_41e7626b9cc03c5c65812ae55e8` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `post_tags_tag` DROP FOREIGN KEY `FK_41e7626b9cc03c5c65812ae55e8`')
    await queryRunner.query('ALTER TABLE `post_tags_tag` DROP FOREIGN KEY `FK_b651178cc41334544a7a9601c45`')
    await queryRunner.query('ALTER TABLE `post` DROP FOREIGN KEY `FK_5c1cf55c308037b5aca1038a131`')
    await queryRunner.query('DROP INDEX `IDX_41e7626b9cc03c5c65812ae55e` ON `post_tags_tag`')
    await queryRunner.query('DROP INDEX `IDX_b651178cc41334544a7a9601c4` ON `post_tags_tag`')
    await queryRunner.query('DROP TABLE `post_tags_tag`')
    await queryRunner.query('DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`')
    await queryRunner.query('DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`')
    await queryRunner.query('DROP TABLE `user`')
    await queryRunner.query('DROP TABLE `post`')
    await queryRunner.query('DROP INDEX `IDX_6a9775008add570dc3e5a0bab7` ON `tag`')
    await queryRunner.query('DROP TABLE `tag`')
  }
}
