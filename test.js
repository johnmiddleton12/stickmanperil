function foo(x) {
    if (x == 0 || x == 1) {
        return x;
    } else {
        return x * foo(x - 1);
    };
};

function age_to_days(age) {
    return age * 365;
}

function countTrue(array) {
    count = 0;
    array.forEach(element => {
        if (element) {
            count += 1;
        };
    });
    return count;
};

function tetra(n) {
    if (n == 1 || n == 0) {
        return n;
    } else {
        return n * (n + 1) / 2 + tetra(n - 1);
    };
};

function invert(arr) {
    for (let row = 0; row < arr.length; row++) {
        for (let column = 0; column < arr[row].length; column++) {
            var element = arr[row][column]
            if (0 <= element && element <= 255) {
                arr[row][column] = 255 - element;
            } else if (element < 0) {
                arr[row][column] = 255;
            } else {
                arr[row][column] = 0;
            };
        };
    };
    return arr
        ;
};

function redundancy(str) {
    return function redundant(str) {
        return str;
    };
}

function isAdjacent(matrix, node1, node2) {
    return matrix[node1][node2] == 1
}

function secondLargest(arr) {
    return arr.sort((a, b) => b - a)[1];
}

function asteroidCollision(asteroids) {
    var new_array = [];
    asteroids.forEach(element => {
        new_element = asteroids.find(test => (element < test));
        if (typeof(new_element) == 'number') {
        new_array.push(new_element);
        }
    });
    return new_array;
}

function bogoSort(arr) {
    var isSorted = function(arr) {
        for(var i = 1; i < arr.length; i++) {
            if (arr[i-1] > arr[i]) {
                return false;
            }
        }
        return true;
    };

    function shuffle(arr) {
        var count = arr.length, temp, index;
        while (count > 0) {
            index = Math.floor(Math.random() * count);
            count--;

            temp = arr[count];
            arr[count] = arr[index];
            arr[index] = temp;
        }
        return arr;
    };

    function sort(arr) {
        var sorted = false;
        while (!sorted) {
            arr == shuffle(arr);
            sorted = isSorted(arr);
        }
        return arr;
    };

    return sort(arr);
}

function main() {
    // console.log('Factorial of 5:', foo(5));
    // console.log('19 Years to Days:', age_to_days(19));
    // console.log('Amount of true values:', countTrue([true, true, false, false]));
    // console.log('Tetra Total of 6:', tetra(6));

    // test_array = [[255, 255, 255], [0, 0, 0], [255, 0, 525]];
    // console.log('array before inversion:', test_array);

    // new_array = invert(test_array);
    // console.log('array after inversion:', test_array);

    // const test_func = redundancy('test')
    // console.log(test_func);
    // console.log(test_func('test'));

    // adj_matrix = [
    //     [0, 1, 0, 0],
    //     [1, 0, 1, 1],
    //     [0, 1, 0, 1],
    //     [0, 1, 1, 0]
    // ];

    // adj_matrix_2 = [
    //     [0, 1, 0, 1, 1],
    //     [1, 0, 1, 0, 0],
    //     [0, 1, 0, 1, 0],
    //     [1, 0, 1, 0, 1],
    //     [1, 0, 0, 1, 0]
    // ]

    // console.log(isAdjacent(adj_matrix, 0, 2));
    // console.log(isAdjacent(adj_matrix_2, 1, 4));

    // console.log(secondLargest([25, 26, 27, 28, 29, 35, 12, 3, 21]))

    // console.log(asteroidCollision([10, 2, -5]))

    var bogo_arr = [32, 4, 123, 24, 56, 2, 43, 123, 3, 4, 12];
    console.log("Array Before - ", bogo_arr);
    console.log("Array Sorted - ", bogoSort(bogo_arr));
}

main()