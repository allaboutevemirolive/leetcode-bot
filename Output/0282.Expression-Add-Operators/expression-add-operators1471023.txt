// https://leetcode.com/problems/expression-add-operators/solutions/1471023/rust-backtracking-solution/
impl Solution {
    pub fn add_operators(num: String, target: i32) -> Vec<String> {
        let v = num.bytes().map(|u| (u - b'0') as i64).collect::<Vec<_>>();
        let mut answer = Vec::new();
        Self::backtrack(&mut answer, &mut Vec::new(), &v, 0, 0, target as i64);
        answer
    }
    fn backtrack(
        answer: &mut Vec<String>,
        ops: &mut Vec<String>,
        v: &[i64],
        val: i64,
        last: i64,
        target: i64,
    ) {
        if v.is_empty() {
            if val == target {
                answer.push(ops[1..].join(""));
            }
            return;
        }
        let mut n = 0;
        for (i, &d) in v.iter().enumerate() {
            n = n * 10 + d;
            ops.push(String::from("+"));
            ops.push(n.to_string());
            Self::backtrack(answer, ops, &v[i + 1..], val + n, n, target);
            ops.pop();
            ops.pop();
            if !ops.is_empty() {
                ops.push(String::from("-"));
                ops.push(n.to_string());
                Self::backtrack(answer, ops, &v[i + 1..], val - n, -n, target);
                ops.pop();
                ops.pop();
                ops.push(String::from("*"));
                ops.push(n.to_string());
                Self::backtrack(
                    answer,
                    ops,
                    &v[i + 1..],
                    val - last + last * n,
                    last * n,
                    target,
                );
                ops.pop();
                ops.pop();
            }
            if v[0] == 0 {
                break;
            }
        }
    }
}