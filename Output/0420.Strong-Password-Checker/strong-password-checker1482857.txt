// https://leetcode.com/problems/strong-password-checker/solutions/1482857/rust-0-ms-faster-than-100-00-2-mb-less-than-100-00/
pub fn repeat_count(password:&String) -> Vec<i32>{
    let mut result = Vec::new();
    let mut currect = 1;
    for i in 0..password.len() - 1{
        if password[i..i+1] == password[i+1..i+2]{
            currect += 1;
        }
        else{
            if currect >= 3{
                result.push(currect);
            }
            currect = 1;
        }
    }
    if currect >= 3{
        result.push(currect);
    }
    result
}

pub fn replace_count(mut vec_count: Vec<i32>, mut del: i32, add: i32, rep: i32, sort_switch: bool) -> i32{
    if vec_count.len() == 0{
        return 0;
    }
    if sort_switch{
        vec_count.sort();
    }
    if add >= 2 || (add == 1 && rep == 1) || (add == 1 && rep == 0 && vec_count[0] < 5){
        return 0;
    }
    if add == 1 && rep == 0 && vec_count[0] == 5{
        return 1;
    }
    if del == 0{
        let mut result_count = 0;
        for i in vec_count{
            result_count += i / 3;
        }
        if result_count >= rep{
            return result_count - rep;
        }
        return 0;
    }

    'loop1: for currcet_index in 1..=3{
        while del >= currcet_index && vec_count[0] == 2 + currcet_index{
            del -= currcet_index;
            vec_count.remove(0);
            if vec_count.len() == 0{
                return 0;
            }
        }
        if del < currcet_index{
            break;
        }
        for i in 0..vec_count.len(){
            while vec_count[i] % 3 == (currcet_index - 1){
                if vec_count[i] == 2 + currcet_index{
                    break;
                }
                vec_count[i] -= currcet_index;
                del -= currcet_index;
                if del < currcet_index{
                    break 'loop1;
                }
            }
        }
    }
    let mut result_count = 0;
    for i in vec_count{
        result_count += i / 3;
    }
    if result_count >= rep{
        return result_count - rep;
    }
    return 0;
}

pub fn compu_type_count(password:&String) -> i32{
    let mut lower_case = 0;
    let mut upper_case=0;
    let mut digit = 0;
    let mut total = 0;
    for i in password.as_bytes(){
        if *i >= 48 && *i <= 57{
            if digit == 0{
                digit = 1;
                total += 1;
                if total == 3{
                    return 3;
                }
                continue;
            }
        }
        if *i >= 65 && *i <= 90{
            if upper_case == 0{
                upper_case = 1;
                total += 1;
                if total == 3{
                    return 3;
                }
                continue;
            }
        }
        if *i >= 97 && *i <= 122{
            if lower_case == 0{
                lower_case = 1;
                total += 1;
                if total == 3{
                    return 3;
                }
                continue;
            }
        }
    }
    return total;
}

impl Solution {
    pub fn strong_password_checker(password: String) -> i32 {
        let new_length = password.len() as i32;
        if new_length > 20{
            let rep = 3 - compu_type_count(&password);
            let del = new_length - 20;
            let vec_count = repeat_count(&password);
            return rep + del + replace_count(vec_count, del, 0, rep, true);
        }
        else if new_length < 6{
            let add = 6 - new_length;
            let type_add = 3 - compu_type_count(&password);
            let rep = 
            if type_add <= add{
                0
            }
            else{
                type_add - add
            };
            return add + rep + replace_count(repeat_count(&password), 0, add, rep, true);
        }
        else{
            let rep = 3 - compu_type_count(&password);
            let vec_count = repeat_count(&password);
            return rep + replace_count(vec_count, 0, 0, rep, true);
        }
    }
}