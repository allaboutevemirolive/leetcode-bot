// https://leetcode.com/problems/regular-expression-matching/solutions/3257832/readable-rust-implementation/
use std::collections::HashSet;

#[derive(Copy, Clone, Debug)]
enum State {
    Start,
    Literal,
    AnyChar,
    ZeroOrMore,
    End,
}

#[derive(Copy, Clone, Debug)]
struct Expression {
    literal: Option<char>,
    state: State,
    position: usize,
}

impl Solution {


    /**
     * Retrieve the next expression from the pattern given the last expression
     */
    #[inline]
    pub fn _next_expression(pattern: &Vec<char>, last: Expression) -> Expression {
        if last.position >= pattern.len() {
            return Expression {
                literal: None,
                state: State::End,
                position: pattern.len() + 1,
            };
        }

        let c = pattern[last.position];

        let mut next: Expression = Expression {
            literal: None,
            state: last.state,
            position: last.position + 1,
        };

        match c {
            '.' => {
                next.literal = None;
                next.state = State::AnyChar
            }
            c => {
                next.literal = Some(c);
                next.state = State::Literal
            }
        }

        if (last.position + 1) < pattern.len() && pattern[last.position + 1] == '*' {
            next.state = State::ZeroOrMore;
            next.position = last.position + 2;
        }

        return next;
    }

    pub fn is_match(s: String, p: String) -> bool {
        let input: Vec<char> = s.chars().collect();
        let pattern: Vec<char> = p.chars().collect();
        let exp_start = Self::_next_expression(
            &pattern,
            Expression {
                literal: None,
                state: State::Start,
                position: 0,
            },
        );

        // HashSet to prune branches of the state machine which have already
        // been evaluated
        let mut seen: HashSet<(usize, usize)> = HashSet::from([(0, 0)]);
        // Stack of states to evaluate
        let mut stack = vec![(0, exp_start)];

        loop {
            let mut c: Option<char> = None;
            let (input_pos, exp) = match stack.pop() {
                Some(s) => s,
                None => return false,
            };
            if input_pos < input.len() {
                c = Some(input[input_pos]);
            }

            // Map the existing state to output states ( or return true, or continue to return false )
            //   next position, this exp (1)
            //   same position, next exp (2)
            //       next position, next exp (3)
            let (npte, spne, npne): (bool, bool, bool) = match (input_pos >= input.len(), exp.state, c == exp.literal) {
                (_, State::Start, _) => todo!(),
                (true, State::Literal, _) => continue,
                (true, State::AnyChar, _) => continue,
                (true, State::ZeroOrMore, true) => (false, true, false),
                (true, State::ZeroOrMore, false) => (false, true, false),
                (true, State::End, _) => return true,
                (false, State::Literal, true) => (false, false, true),
                (false, State::Literal, false) => continue,
                (false, State::AnyChar, _) => (false, false, true),
                (false, State::ZeroOrMore, true) => (true, true, false),
                (false, State::ZeroOrMore, false) => {
                    if exp.literal == None {
                        (true, true, false)
                    } else {
                        (false, true, false)
                    }
                }
                (false, State::End, _) => continue,
            };

            let next_e = Self::_next_expression(&pattern, exp);

            // Add the three possible state transitions to the stack
            if spne {
                if !seen.contains(&(input_pos, next_e.position)) {
                    stack.push((input_pos, next_e));
                    seen.insert((input_pos, next_e.position));
                }
            }
            if npne {
                if !seen.contains(&(input_pos + 1, next_e.position)) {
                    stack.push((input_pos + 1, next_e));
                    seen.insert((input_pos + 1, next_e.position));
                }
            }
            if npte {
                if !seen.contains(&(input_pos + 1, exp.position)) {
                    stack.push((input_pos + 1, exp));
                    seen.insert((input_pos + 1, exp.position));
                }
            }
        }
    }
}