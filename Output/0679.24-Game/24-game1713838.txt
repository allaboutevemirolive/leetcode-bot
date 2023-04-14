// https://leetcode.com/problems/24-game/solutions/1713838/rust-0ms/
impl Solution {
    /*
	Totally 5 possibilities for parenthesis arrangment.
    // (0 op 1) op 2 op 3,   this is covered by below 2 cases
    1. (0 op 1) op (2 op 3),
    2. ((0 op 1) op 2) op 3,
    
    // 0 op (1 op 2) op 3,   this is covered by below 2 cases
    3. (0 op (1 op 2)) op 3,
    4. 0 op ((1 op 2) op 3),

    // 0 op 1 op (2 op 3),   this is covered by case 1 and case 5
    // (0 op 1) op (2 op 3), this is dup to case 1
    5. 0 op (1 op (2 op 3)),
    */
    pub fn judge_point24(cards: Vec<i32>) -> bool {
        use std::collections::HashSet;
        let ops = vec!['+', '-', '*', '/'];

        fn calc(m: f64, op: char, n:f64) -> f64 {
            match op {
                '+' => m + n,
                '-' => m - n,
                '*' => m * n,
                '/' => m / n,
                _ => panic!("operation not supported")
            }
        }

		// help to evaluate an expression by using all operators
        fn eval<F>(ops: &Vec<char>, f: F) -> bool where F: Fn(char, char, char) -> f64 {
            for i in 0..4 {
                for j in 0..4 {
                    for k in 0..4 {
                        let val = f(ops[i], ops[j], ops[k]);
                        if (val - 24.0).abs() < 0.001 {
                            return true;
                        }
                    }
                }
            }
            false
        }

		// find all unique permutations of a integer vector.
        fn all_permutations(items: Vec<i32>) -> Vec<Vec<i32>> {
            let mut result_hash = HashSet::new();
            if items.len() == 1 {
                return vec![items];
            }
            for i in 0..items.len() {
                let item = items[i];
                let rest = items.iter().enumerate().filter_map(|(index, &r)| if index != i {Some(r)} else {None}).collect::<Vec<i32>>();
                let mut rest_permutations = all_permutations(rest);
                rest_permutations.iter_mut().for_each(|v| {
                    let mut new_vec = vec![item];
                    new_vec.append(v);
                    result_hash.insert(new_vec);
                });
            }
            result_hash.into_iter().collect::<Vec<Vec<i32>>>()
        }

        let permutations = all_permutations(cards.into_iter().collect::<Vec<i32>>());
        // println!("Permutations: {:?}", permutations);
        for permutation in permutations {
            // (0 op 1) op (2 op 3)
            if eval(&ops, |op_i, op_j, op_k|
                calc(calc(permutation[0] as f64, op_i, permutation[1] as f64), op_j, calc(permutation[2] as f64, op_k, permutation[3] as f64)) ) {
                return true;
            }

            // ((0 op 1) op 2) op 3
            if eval(&ops, |op_i, op_j, op_k|
                calc(calc(calc(permutation[0] as f64, op_i, permutation[1] as f64), op_j, permutation[2] as f64), op_k, permutation[3] as f64) ) {
                return true;
            }
            // (0 op (1 op 2)) op 3
            if eval(&ops, |op_i, op_j, op_k|
                calc(calc(permutation[0] as f64, op_i, calc(permutation[1] as f64, op_j, permutation[2] as f64)), op_k, permutation[3] as f64) ) {
                return true;
            }
            // 0 op ((1 op 2) op 3)
            if eval(&ops, |op_i, op_j, op_k|
                calc(permutation[0] as f64, op_i, calc(calc(permutation[1] as f64, op_j, permutation[2] as f64) as f64, op_k, permutation[3] as f64)) ) {
                return true;
            }
            // 0 op (1 op (2 op 3))
            if eval(&ops, |op_i, op_j, op_k|
                calc(permutation[0] as f64, op_i, calc(permutation[1] as f64, op_j, calc(permutation[2] as f64, op_k, permutation[3] as f64))) ) {
                return true;
            }
        }

        false
    }
}