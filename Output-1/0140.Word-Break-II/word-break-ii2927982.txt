// https://leetcode.com/problems/word-break-ii/solutions/2927982/1ms-rust-solution-with-tabulation/
impl Solution {
    pub fn word_break(s: String, word_dict: Vec<String>) -> Vec<String> {
        let mut table: Vec<Vec<Vec<String>>> = Vec::new();
        for _i in 0..s.len() + 1 {
            table.push(vec![]);
        }
        table[0] = vec![vec![]];
        for i in 0..s.len() + 1 {
            for word in word_dict.iter() {
                if i + word.len() <= s.len() {
                    if s.chars().skip(i).take(word.len()).collect::<String>() == word.clone() {
                        let mut new_collection: Vec<Vec<String>> = table[i].clone();
                        for j in 0..new_collection.len() {
                            new_collection[j].push(word.clone());
                        }
                        let mut new_collection2: Vec<Vec<String>> = table[i + word.len()].clone();
                        table[i + word.len()] = new_collection;
                        table[i + word.len()].append(&mut new_collection2);
                    }
                }
            }
        }
        let answer_in_vec: Vec<Vec<String>> = table[s.len()].clone();
        let mut answer_in_string: Vec<String> = Vec::new();
        for i in 0..answer_in_vec.len() {
            answer_in_string.push(String::from(""));
            for j in 0..1 {
                answer_in_string[i] = [answer_in_string[i].clone(), answer_in_vec[i][j].clone()].concat();
            }
            for j in 1..answer_in_vec[i].len() {
                answer_in_string[i] = [answer_in_string[i].clone(), String::from(" "), answer_in_vec[i][j].clone()].concat();
            }
        }
        answer_in_string
    }
}