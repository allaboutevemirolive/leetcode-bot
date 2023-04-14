// https://leetcode.com/problems/ipo/solutions/3221752/rust-solution-na-ve-and-passes-with-explanation/
pub fn find_maximized_capital(k: i32, w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {

    let mut total_capital = w;
    let mut projects_completed = 0;
    //create list of (profit, capital) tuples
    let mut projects: Vec<(i32,i32)> = profits.iter().enumerate().map(|(idx, value)|(*value, capital[idx])).collect();
    //sort them, with highest profit projects first
    projects.sort_by(|a, b| b.0.cmp(&a.0));

    //now loop until we've reached k projects completed
    while projects_completed < k {
        //find projects that meet these requirements
        if let Some(pos) = projects.iter().position(|(profit,capital)| {
                    //the cost are lower than our capital
                    if *capital <= total_capital {
                        //if this is true, we found a project
                        projects_completed += 1;
                        //update the total
                        total_capital += profit;
                        //and return from this close so that the project can be deleted
                        return true;
                    } else {
                        //here we have not yet found project, continue 
                        return false;
                    }
                })
            {
            //if we found one, delete it from the project list
            projects.remove(pos);
        } else {
            //if not, there's no more projects to find, terminate
            return total_capital;;
        }

    }
    //loops closed, so we readched K projects completed
    return total_capital;
}