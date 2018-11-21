'use strict'

class CreateGroup {

  get rules () {

    return {
      name: 'required|min:3|max:20',
    }

  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }

}

module.exports = CreateGroup
