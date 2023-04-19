// https://leetcode.com/problems/word-break-ii/solutions/1293695/rust-0ms/
impl Solution {
    pub fn generate_children(rest: &String, word_dict: &Vec<String>) -> Vec<[String; 2]> {
        let mut children: Vec<[String; 2]> = Vec::new();
        let mut prefixes: String = String::from("");
        for character in rest.chars() {
            prefixes.push(character);
            if word_dict.contains(&prefixes) {
                
                children.push([String::from(&rest[..prefixes.len()]), String::from(&rest[prefixes.len()..])]);
            }
        }
        return children;
    }

    pub fn dfs(rest: &String, current_string: String, word_dict: &Vec<String>, mut result: &mut Vec<String>) {
        if rest == "" {
            result.push(current_string);
        } else {
            let children: Vec<[String;2]> = Solution::generate_children(&rest, &word_dict);
            for child in children {
                let mut new_current_string;
                if current_string == "" {
                    new_current_string = child[0].clone();
                } else {
                    new_current_string = format!("{} {}", current_string, child[0]);
                }
                Solution::dfs(&child[1], new_current_string, &word_dict, &mut result);
            }
        }
    }
    pub fn word_break(s: String, word_dict: Vec<String>) -> Vec<String> {
        let mut result: Vec<String> = Vec::new();
        Solution::dfs(&s, String::from(""), &word_dict, &mut result);
        return result;
    }
}