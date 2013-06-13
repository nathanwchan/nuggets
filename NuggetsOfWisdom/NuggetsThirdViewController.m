//
//  NuggetsThirdViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetsThirdViewController.h"
#import "NuggetsTableViewCell.h"
#import <Parse/Parse.h>

@interface NuggetsThirdViewController ()

@end

@implementation NuggetsThirdViewController

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self loadNuggets];
    [self.refreshControl addTarget:self
                            action:@selector(loadPlaces)
                  forControlEvents:UIControlEventValueChanged];
}

- (void)loadNuggets
{
//    [self.refreshControl beginRefreshing];
    dispatch_queue_t loaderQ = dispatch_queue_create("loader", NULL);
    dispatch_async(loaderQ, ^{
        PFQuery *query = [PFQuery queryWithClassName:@"Nugget"];
        [query whereKey:@"Tag" notEqualTo:@"steve jobs"];
        [query orderByDescending:@"createdAt"];
        NSArray *nuggets = [query findObjects];
        dispatch_async(dispatch_get_main_queue(), ^{
            self.nuggets = nuggets;
            [self.tableView reloadData];
//            [self.refreshControl endRefreshing];
        });
    });
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (NSString *)nuggetForRow:(NSUInteger)row
{
    return self.nuggets[row][@"Content"];
}

- (NSString *)nuggetSourceForRow:(NSUInteger)row
{
    return self.nuggets[row][@"Source"];
}

- (NSString *)nuggetTagForRow:(NSUInteger)row
{
    return self.nuggets[row][@"Tag"];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.nuggets count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"NuggetCell";
    NuggetsTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"NuggetCell" owner:self options:nil];
        cell = [nib objectAtIndex:0];
    }
    
    cell.nuggetSourceLabel.text = [self nuggetSourceForRow:indexPath.row];
    cell.nuggetLabel.text = [self nuggetForRow:indexPath.row];
    cell.nuggetTag.text = [self nuggetTagForRow:indexPath.row];
    
    return cell;
}

/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    }   
    else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
{
}
*/

/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Navigation logic may go here. Create and push another view controller.
    /*
     <#DetailViewController#> *detailViewController = [[<#DetailViewController#> alloc] initWithNibName:@"<#Nib name#>" bundle:nil];
     // ...
     // Pass the selected object to the new view controller.
     [self.navigationController pushViewController:detailViewController animated:YES];
     */
}

@end