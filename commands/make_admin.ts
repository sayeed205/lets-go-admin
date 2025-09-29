import { args, BaseCommand } from '@adonisjs/core/ace'

import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import { UserRoleEnum } from '#enums/user'

export default class MakeAdmin extends BaseCommand {
  static commandName = 'make:admin'
  static description = 'Create a new admin'

  static options: CommandOptions = { startApp: true, allowUnknownFlags: false }
  static help = ['The make:admin command is used to create a new admin in the database']

  @args.string()
  declare name: string

  @args.string()
  declare email: string

  @args.string()
  declare password: string

  async run() {
    const user = await User.findBy('email', this.email)
    if (user) {
      this.logger.warning(`${user.email} is already exists`)
      this.logger.warning('Updating name and password')
    }
    await User.updateOrCreate(
      { email: this.email },
      { name: this.name, email: this.email, password: this.password, role: UserRoleEnum.ADMIN }
    )
  }
}
