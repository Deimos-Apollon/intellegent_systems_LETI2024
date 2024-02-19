function getPos3Flags(flags, dists) {
    const [f1, f2, f3] = flags
    const [d1, d2, d3] = dists

    let x1 = f1.x, y1 = f1.y
    let x2 = f2.x, y2 = f2.y
    let x3 = f3.x, y3 = f3.y

    let valid_x_list = []
    let valid_y_list = []

    // Edge cases
    if (x1 == x2) {
        let y = (y2**2 - y1**2 + d1**2 - d2**2) / (2*(y2-y1))
        valid_y_list.push(y)
    }
    if (y1 == y2) {
        let x = (x2**2 - x1**2 + d1**2 - d2**2) / (2*(x2-x1))
        valid_x_list.push(x)
    }

    // Find valid x and y from 
    const borders = {x_min: -54, x_max: 54, y_min: -32, y_max: 32}
    sign = [-1, 1]
    res = []
    if (valid_y_list.length == 0) {
        const alpha = (y1-y2) / (x2-x1)
        const beta = (y2**2 - y1**2 + x2**2 - x1**2 + d1**2 - d2**2) / (2*(x2-x1))
        const a = alpha**2 + 1
        const b = -2*(alpha*(x1-beta) + y1)
        const c = (x1 - beta)**2 + y1**2 - d1**2
        const D = Math.sqrt(b**2 - 4*a*c)
        for (y_sign of sign) {
            let try_y = (-b + y_sign*D)/(2*a)
            if ((borders.y_min <= try_y) && (try_y <= borders.y_max)) {
                valid_y_list.push(try_y)
            }
        }
    }
    if (valid_x_list.length == 0)
        for (x_sign of sign)
            for (y of valid_y_list) {
                let try_x = x1 + x_sign*Math.sqrt(d1**2 - (y - y1)**2)
                if ((borders.x_min <= try_x) && (try_x <= borders.x_max))
                    valid_x_list.push(try_x)
            }

    let best_solution = {x: null, y: null}
    let best_acc = Infinity
    for (try_x of valid_x_list) {
        for (try_y of valid_y_list) {
            let d_i = Math.sqrt((try_x - x3) ** 2 + (try_y - y3) ** 2)
            let error = Math.abs(d_i - d3)
            if (error < best_acc) {
                best_solution.x = try_x
                best_solution.y = try_y
                best_acc = error
            }  
        }
    }

    return best_solution
}

module.exports = getPos3Flags;