class Util {
  static arrayMove(array: any[], from: number, to: number): any[] {
    const newArray = array.slice()
    newArray.splice((to < 0 ? newArray.length + to : to), 0, newArray.splice(from, 1)[0])

    return newArray
  }
}

export default Util
