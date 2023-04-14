// https://leetcode.com/problems/longest-valid-parentheses/solutions/1913262/optimal-rust-solution-using-stack-0ms/
pub fn longest_valid_parentheses(s: String) -> i32 {
    let n = s.len();
    let mut max = 0;
    let mut stack = vec![];

    // Push -1 to stack to handle edge cases
    stack.push(-1);

    for (i, ch) in s.chars().enumerate() {
        // If it is opening parenthesis, push the index to stack
        if ch == '(' {
            stack.push(i as i32);
        }

        // If it is closing parenthesis
        else {
            // Pop the top element and check if it is empty
            // If empty push the index of current char
            stack.pop();
            if stack.is_empty() {
                stack.push(i as i32);
            } else {
                // If it is not empty update the max
                max = std::cmp::max(max, i as i32 - stack.last().unwrap());
            }
        }
    }

    return max as i32;
}