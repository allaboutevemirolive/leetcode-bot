// https://leetcode.com/problems/number-of-atoms/solutions/3319853/rust-2-approaches/
impl Solution {
    pub fn count_of_atoms(formula: String) -> String {
        fn using_recursion(formula: String) -> String {
            use std::collections::BTreeMap;
            fn parse_formula(formula: &Vec<char>, i: &mut usize) -> BTreeMap<String, i32> {
                let len = formula.len();
                let mut count = BTreeMap::new();
                while *i < len && formula[*i] != ')' {
                    if formula[*i] == '(' {
                        *i += 1;
                        for (atom, mul) in parse_formula(formula, i) {
                            *count.entry(atom).or_insert(0) += mul.max(1);
                        }
                    } else {
                        let i_start = *i;
                        *i += 1;
                        while *i < len && formula[*i].is_lowercase() {
                            *i += 1;
                        }
                        let name = formula[i_start..*i].iter().copied().collect::<String>();

                        let i_start = *i;
                        while *i < len && formula[*i].is_ascii_digit() {
                            *i += 1;
                        }
                        let multiplicity = (i_start..*i)
                            .map(|i| formula[i])
                            .fold(0, |num, val| num * 10 + (val as i32 - '0' as i32))
                            .max(1);

                        *count.entry(name).or_insert(0) += multiplicity;
                    }
                }
                *i += 1;
                let i_start = *i;
                while *i < len && formula[*i].is_ascii_digit() {
                    *i += 1;
                }
                let multiplicity = (i_start..*i)
                    .map(|i| formula[i])
                    .fold(0, |num, val| num * 10 + (val as i32 - '0' as i32))
                    .max(1);
                count.iter_mut().for_each(|(_, v)| *v *= multiplicity);
                count
            }

            let formula = formula.chars().collect::<Vec<_>>();
            let count = parse_formula(&formula, &mut 0);
            count.into_iter().fold(String::new(), |mut res, (k, v)| {
                res.push_str(k.as_str());
                if v > 1 {
                    res.push_str(v.to_string().as_str());
                }
                res
            })
        }
        
        fn using_stack(formula: String) -> String {
            use std::collections::BTreeMap;
            let formula = formula.chars().collect::<Vec<_>>();
            let mut stack = vec![];
            stack.push(BTreeMap::new());
            let mut i = 0;
            while i < formula.len() {
                match formula[i] {
                    '(' => {
                        i += 1;
                        stack.push(BTreeMap::new());
                    }
                    ')' => {
                        let top = stack.pop().unwrap();
                        i += 1;
                        let i_start = i;
                        while i < formula.len() && formula[i].is_ascii_digit() {
                            i += 1;
                        }
                        let multiplier = formula[i_start..i]
                            .iter()
                            .collect::<String>()
                            .parse::<i32>()
                            .unwrap_or(0)
                            .max(1);
                        for (k, v) in top {
                            *stack.last_mut().unwrap().entry(k).or_insert(0) += v * multiplier;
                        }
                    }
                    _ => {
                        let i_start = i;
                        i += 1;
                        while i < formula.len() && formula[i].is_lowercase() {
                            i += 1;
                        }
                        let name = formula[i_start..i].iter().collect::<String>();
                        let i_start = i;
                        while i < formula.len() && formula[i].is_ascii_digit() {
                            i += 1;
                        }
                        let multiplier = formula[i_start..i]
                            .iter()
                            .collect::<String>()
                            .parse::<i32>()
                            .unwrap_or(0)
                            .max(1);
                        *stack.last_mut().unwrap().entry(name).or_insert(0) += multiplier;
                    }
                }
            }

            let count = stack.pop().unwrap();
            count.into_iter().fold(String::new(), |mut res, (k, v)| {
                res.push_str(k.as_str());
                if v > 1 {
                    res.push_str(v.to_string().as_str());
                }
                res
            })
        }
        using_stack(formula)       
    }
}