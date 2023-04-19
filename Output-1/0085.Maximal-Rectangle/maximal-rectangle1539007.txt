// https://leetcode.com/problems/maximal-rectangle/solutions/1539007/rust-reducing-the-problem-to-84-largest-rectangle-in-histogram/
pub fn maximal_rectangle(matrix: Vec<Vec<char>>) -> i32 {
    if matrix.len() == 0 || matrix[0].len() == 0 {
        return 0;
    }

    // in rust `char` is a string type and not a numeric type, so we have to allocate a new grid of the proper type
    let mut grid = vec![vec![0; matrix[0].len()]; matrix.len()];

    //preprocess the grid, so that each row contains the maximum "height"
    // of a contiguous rectangle of width 1
    for c in 0..matrix[0].len() {
        if matrix[0][c] == '1' {
            grid[0][c] = 1;
        }
    }

    for r in 1..matrix.len() {
        for c in 0..matrix[r].len() {
            if matrix[r][c] == '1' {
                grid[r][c] = 1 + grid[r - 1][c];
            }
        }
    }

    let mut reuse_widths = vec![0; grid[0].len()];
    let mut reuse_stack = vec![0; grid[0].len()];

    let mut max_area = 0;
    for row in grid.iter() {
        let area = largest_rectangle_area(row, &mut reuse_widths, &mut reuse_stack);
        max_area = max_area.max(area);
    }

    max_area
}

// This is the solution from "84. Largest Rectangle in Histogram", except for
// passing an external buffers so we can reuse them for each row, thus avoiding
// multiple expensive (de)allocations.
pub fn largest_rectangle_area(
    heights: &[i32],
    widths: &mut [usize],
    stack: &mut Vec<usize>,
) -> i32 {
    assert_eq!(heights.len(), widths.len());
    widths.iter_mut().for_each(|v| *v = heights.len());
    stack.clear();

    // find the next smaller element (i.e. the right boundary of the rectangle)
    for (idx, &x) in heights.iter().enumerate() {
        while let Some(&pos) = stack.last() {
            if x >= heights[pos] {
                break;
            }

            widths[pos] = idx;
            stack.pop();
        }

        stack.push(idx);
    }

    // We've processed the whole array from left to right, and there are
    // no smaller elements than those in the stack. So their right boundary
    // is the array length, but as we've already initialized it with that
    // value we have nothing to do now.
    stack.clear();

    let mut max_area = 0;

    // find the previous smaller element (i.e. the left boundary of the rectangle)
    for (idx, &x) in heights.iter().enumerate().rev() {
        while let Some(&pos) = stack.last() {
            if x >= heights[pos] {
                break;
            }

            // `idx` contains the smaller element, but the start index needs
            // to be equal or larger, that's why the left boundary is `idx + 1`
            //
            // So we can finally compute the width by subtracting `idx+1` from
            // the already stored right boundary
            let area = (widths[pos] - (idx + 1)) as i32 * heights[pos];
            max_area = max_area.max(area);

            stack.pop();
        }

        stack.push(idx);
    }

    // We've processed the whole array from right to left, and there are
    // no smaller elements than those in the stack. So their left boundary
    // is the beginning of the array, i.e. 0, so compute the `max_area` for the
    // remaining elements
    while let Some(pos) = stack.pop() {
        let area = widths[pos] as i32 * heights[pos];
        max_area = max_area.max(area);
    }

    max_area
}