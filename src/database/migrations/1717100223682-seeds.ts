import { MigrationInterface, QueryRunner } from 'typeorm';

export class seeds1717100223682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DO $$
        DECLARE
        admin_user_id UUID;
        regular_user_id UUID;
        BEGIN
        -- Create admin user
        INSERT INTO public."user" (id, "createdAt", "updatedAt", "firstName", "lastName", email)
        VALUES (uuid_generate_v4(), now(), now(), 'John', 'Doe', 'admin@admin.com')
        RETURNING id INTO admin_user_id;

        -- Create regular user
        INSERT INTO public."user" (id, "createdAt", "updatedAt", "firstName", "lastName", email)
        VALUES (uuid_generate_v4(), now(), now(), 'Jane', 'Doe', 'regular@regular.com')
        RETURNING id INTO regular_user_id;

        -- Passwords
        INSERT INTO public.user_auth
        ("password", "userId")
        VALUES('root', admin_user_id);

        INSERT INTO public.user_auth
        ("password", "userId")
        VALUES('root', regular_user_id);

        -- Roles
        INSERT INTO public.user_role
        ("role", "userId")
        VALUES('regular_user', admin_user_id);

        INSERT INTO public.user_role
        ("role", "userId")
        VALUES('admin', admin_user_id);

        INSERT INTO public.user_role
        ("role", "userId")
        VALUES('regular_user', regular_user_id);
        END $$;  
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "user" WHERE email IN ('admin@admin.com', 'regular@regular.com');
    `);
  }
}
