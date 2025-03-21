import { LightningElement, track, wire} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Accounts from '@salesforce/schema/Account';
import keyaccount from '@salesforce/apex/AdequacyGlassIcon.KeyAccountlist';
import withoutDate from '@salesforce/apex/AdequacyGlassIconWire.KeyAccountlist';
import missedacc from  '@salesforce/apex/AdequacyGlassIconWire.returnAccounts';
import accountProgram from '@salesforce/schema/Account.Type';
import OpportunityStage from '@salesforce/schema/Opportunity.StageName';
import Opportunity from '@salesforce/schema/Opportunity';
import Opportunitysalesarea from '@salesforce/schema/Opportunity.Sales_Area__c';
import Region from '@salesforce/schema/Opportunity.Region__c';
import PROFILE_NAME_FIELD from '@salesforce/schema/User.Profile.Name';
import strUserId from '@salesforce/user/Id';
import {getRecord} from 'lightning/uiRecordApi';


export default class adeqacyReportWithGlassicon extends LightningElement {
    
    @track checkvalue = false;
    @track isfilter = false;
    @track closefilter = false;
    @track PicklistValues;
    @track contactData = {}
    columnHeader = ['ID', 'Name']
    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    records = []; //All records available in the data table
    @track keysArray;
    AccoundIdsList = [];
    //columns = []; //columns information available in the data table
    @track total; //Total no.of records
    pageSize = 5; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page
    displayrec = [];
    stageArray = [];

    @wire(getRecord, {recordId: strUserId,fields: [PROFILE_NAME_FIELD]}) 
    wireuser({error,data }) {
        if (error) {
           this.error = error ; 
        } else if (data) {
            this.prfName =data.fields.Profile.value.fields.Name.value; 
            console.log(this.prfName);
            if(this.prfName === 'Inspire KAM User' || this.prfName === 'Infinity KAM User'){
                     this.kam = true;

            }else{
                this.Nonkam =true;
            }
            if(this.prfName == 'Inspire KAM User'){
                this.recordtype = 'Inspire';
              }
              if(this.prfName == 'Infinity KAM User'){
                this.recordtype = 'Infinity';
              }
        }
    }

    @track data =[];
    @track columns;
    @track error;
    @track recordtype;
    @track sales;
    loaded = false;
    @track glassIcon= false;
    @track  oppStage;
    @track arrayoppStage =[];
    @track arrayacctype =[];
    @track grouped;
    @track accounttype;
    @track fromdate;
    @track todate;
    @track accprogram;
    @track oppregion;
    Inspire = false;
    Infinity = false;
    Gdata = false;
    @track PicklistValues;
    @track PicklistValues2;
    @track PicklistValues3;
    @track PicklistValues4;
    @track AccountCount = 0;
    @track total = false;
    @wire (getObjectInfo,{objectApiName : Accounts})
    accountInfo;
    @wire (getObjectInfo,{objectApiName : Opportunity})
    opportunityInfo;

   

    get business(){
        return [
            {label: 'Infinity',value: 'Infinity'},
            {label: 'Inspire',value: 'Inspire'},
        ];
    }
    glassiconhandleChange(event){
        this.glassIcon = event.target.checked;
        console.log('glassicon'+this.glassIcon);
    }

    @wire(getPicklistValues,
        {
        recordTypeId : '$opportunityInfo.data.defaultRecordTypeId',
        fieldApiName : Region,
    }
    )
    
    regvalues(result) {
        //alert('region');
        if (result.data) {
           console.log('region values$$$$$$$$$$$$$$$$$$$$$$$$$'+ JSON.stringify(result.data));
            this.PicklistValues4 = [ { label: '--None--', value:null, selected: true }, ...result.data.values ];
        } else if (result.error) {
            alert('ERROR');
        }
    }


    @wire(getPicklistValues,
        {
        recordTypeId : '$opportunityInfo.data.defaultRecordTypeId',
        fieldApiName : Opportunitysalesarea,
    }
    )
    
    picvalues(result) {
        //alert()
        if (result.data) {
           // console.log(JSON.stringify(result.data));
            this.PicklistValues = [ { label: '--None--', value:null, selected: true }, ...result.data.values ];
        } else if (result.error) {
            alert('ERROR');
        }
    }
    @wire(getPicklistValues,
        {
        recordTypeId : '$accountInfo.data.defaultRecordTypeId',
        fieldApiName : accountProgram,
    }
    )
    
    accProgramvalues(result) {
        if (result.data) {
           // console.log(JSON.stringify(result.data));
            this.PicklistValues2 = [ { label: '--None--', value:null, selected: true }, ...result.data.values ];
        } else if (result.error) {
            alert('ERROR');
        }
    }

    
    @wire(getPicklistValues,
        {
        recordTypeId : '$opportunityInfo.data.defaultRecordTypeId',
        fieldApiName : OpportunityStage,
    }
    )
    stagevalues(result) {
        if (result.data) {
          // console.log('gokul>>>>>>>>>>>>>>>>>', JSON.stringify(result.data));
           this.stageArray =  [{ label: '--None--', value:null, selected: true }, ...result.data.values ];
           console.log('gokul>>>>>>>>>>>>>>>>>', JSON.stringify(result.data));
           const x = this.stageArray.splice(1, 1);

            this.PicklistValues3 = x

        } else if (result.error) {
            alert('ERROR');
        }
    }

    get oppsatage(){
        return [
            {label: 'Prospecting',value: 'Prospecting'}, 	
            {label: 'Specified',value: 'Specified'},
            {label: 'Confirmed',value: 'Confirmed'},
            {label: 'On-Going',value: 'On-Going'},
        ];
    }
        
    handlebusinessChange(event){
      this.recordtype = event.target.value;
      console.log('recordtype================'+ this.recordtype)
      
    }
    handlesalesareaChange(event){
        debugger
        this.sales = event.target.value;
        console.log('Sales Area===================='+ this.sales)
    }
    handleaccprogramChange(event){
     this.accprogram = event.target.value;
     console.log('Account program======================='+ this.accprogram)
    }
    handleregionChange(event){
        this.oppregion = event.target.value;
        console.log('Region======================='+ this.oppregion)
       }
    handleaccounttypeChange(event){
      this.accounttype = event.target.value;
      //this.arrayacctype = [... this.arrayoppStage, this.accounttype]
      //alert('Account Type==========================='+ this.accounttype)
      console.log('Account Type==========================='+ this.accounttype)
    }
    handlestage(event){
        this.oppStage = event.target.value;
        this.arrayoppStage = [...this.arrayoppStage, this.oppStage];
        console.log('Opportunity stage========================+'+ this.oppStage)
        console.log('Arrray Opportunity stage========================+'+ this.arrayoppStage)
    }

    
    fromDateChange(event){
        this.fromdate = event.target.value;
        console.log('From Date++++++++++++++++++++'+ this.fromdate)
    }
    toDateChange(event){
        this.todate = event.target.value;
        console.log('To Date+++++++++++++++++++++++'+ this.todate)
    }
    

    get options() {
        console.log('inside the options')
        return [
            { label: '--None--', value:null},
            { label: 'Strategic Account', value: 'Strategic Account'},
            { label: 'National Key Account', value: 'National Key Account'},
            { label: 'Build +', value: 'Build +'},
            { label: 'Udaan', value: 'Udaan'},
            { label: 'GrowARC', value: 'GrowARC'},
            { label: 'Platinum Customer', value: 'Platinum Customer'},
            { label: 'SGA Assured Processor', value: 'SGA Assured Processor'},
            { label: 'Kings Club', value: 'Kings Club'},
            { label: 'Inspirations', value: 'Inspirations'},
            { label: 'Modern Homes', value: 'Modern Homes'},
            { label: 'Udaan Processor', value: 'Udaan Processor'},
            { label: 'Inspire Strategic Account', value: 'Inspire Strategic Account'},
            { label: 'SG honors', value: 'SG honors'},
            { label: 'NKA/SKA Inspire', value: 'NKA/SKA Inspire'},
            { label: 'Star Architect', value: 'StartArchitecht'},
        ];
    }
     
        submit(){
        
        this.loaded = true;
        this.isfilter = false;

        console.log('Record Type >>>>>>>>>>>>>+'+ this.recordtype)
        console.log('BeforeOpportunity stage========================+'+ this.oppStage)
        console.log('From Date =======+'+ this.fromdate)
        console.log('TO Date   ==============+'+ this.todate)
        if(this.recordtype == null){
            
            this.error = 'Please Select Record Type';
            this.loaded = false;
        }

        else if(this.arrayoppStage.length === 0){
            //alert('Please Select Opportunity Stage')
            this.error = 'Please Select Opportunity Stage';
            this.loaded = false;
            this.Gdata = false;
        }

        
      

        
        /*else if(this.accprogram == null & this.sales ==null & this.accounttype ==null & this.oppStage){
            this.error = 'Please select any One of these fields (Sales Area (or) Account Program (or) Account Type (or) Opportuninty Stage)';
            this.Gdata = false;
        }*/
        
        else if(this.fromdate == null & this.todate != null){
            this.error = 'Please fill the both dates';
            this.loaded = false;
            this.Gdata = false;
        }
        
        else if(this.fromdate != null & this.todate == null){
            this.error = 'Please fill the both dates';
            this.loaded = false;
            this.Gdata = false;
        }
        
        if(this.recordtype == 'Inspire'){


            this.Infinity = false;
            this.Inspire = true;
            
            //this.columns = columns;
        }
        
        else if(this.recordtype == 'Infinity'){
            this.Inspire = false;
            this.Infinity =true;
            //this.columns = columns1;
        }
        

        else if(this.fromdate == null & this.todate == null){

            this.error = 'Please choose Date';
            this.loaded = false;
            this.Gdata = false;

        }
           

            console.log('Enter into  ApexClass');
            withoutDate({recordtype:this.recordtype,  sales:this.sales,  oppStage:this.oppStage, oppregion: this.oppregion, fdate:this.fromdate, tdate:this.todate, })
            .then(result=>{
               // console.log('data======>'+result);
                //this.data = result;
                this.loaded = false;
    
               const namesArray = result.map(variable => variable.AccountName);
               const uniqueNamesSet = new Set(namesArray);
               const uniqueNamesArray = Array.from(uniqueNamesSet);
               this.keysArray= uniqueNamesArray.length;

               const AccountArray = result.map(variable => variable.AccountIds);
               const uniqueIdSet = new Set(AccountArray);
               const uniqueIdArray = Array.from(uniqueIdSet);
               this.AccoundIdsList = uniqueIdArray;
               console.log('this.AccoundIdsList>>>>>>>>>>>'+ this.AccoundIdsList);
               console.log('this.AccoundIdsList>>>>>>>>>>>'+ this.AccoundIdsList.length);
    
                const filteredList = result.filter((item, index) => {
                    return index === result.findIndex(obj => {
                        return JSON.stringify(obj) === JSON.stringify(item);
                    });
                  });
                  
                  this.data = filteredList;
                  this.total = filteredList.length; // update total records count
                  //this.pageSize = 10;
                  //this.records = filteredList; //set pageSize with default value as first option
                  //this.paginationHelper(); // call helper menthod to update pagination logic 
                  console.log('filteredList+++++++++++++###########'+JSON.stringify(filteredList) );
                  
            
                    if(this.data == null || this.data == ''){
                        this.error = 'No Records Found';
                        this.Gdata = false;
                    }else{
                    this.Gdata = true;
                    this.error = undefined;
                    }
                    
    
                })
                
            .catch(error=>{
                //alert('Error>>>>>>>>>>>>'+ JSON.stringify(error))
                this.loaded = false;
                this.Gdata = false;
                this.error = error; //.body.message;
            
            })
        
        /*else{

            this.error = 'Please choose ALL Required Field';
            this.loaded = false;
            this.Gdata = false;

        }*/
            

            

            
            /*else {
         console.log('Enter into dateApex class')
        keyaccount({recordtype:this.recordtype, acctype: this.accounttype, sales:this.sales,accprogram:this.accprogram,fdate:this.fromdate,tdate:this.todate, oppStage:this.oppStage, oppregion: this.oppregion })
        .then(result=>{
           // console.log('data======>'+result);
            //this.data = result;
            this.loaded = false;

               const namesArray = result.map(variable => variable.AccountName);
               const uniqueNamesSet = new Set(namesArray);
               const uniqueNamesArray = Array.from(uniqueNamesSet);
               this.keysArray= uniqueNamesArray.length;


            const filteredList = result.filter((item, index) => {
                return index === result.findIndex(obj => {
                    return JSON.stringify(obj) === JSON.stringify(item);
                });
              });
              
              this.data = filteredList;
              this.total = filteredList.length; // update total records count
              //this.pageSize = 10;
              //this.records = filteredList; //set pageSize with default value as first option
              //this.paginationHelper(); // call helper menthod to update pagination logic 
              console.log('filteredList+++++++++++++###########'+JSON.stringify(filteredList) );
              
        
                if(this.data == null || this.data == ''){
                    this.error = 'No Records Found';
                    this.Gdata = false;
                }else{
                this.Gdata = true;
                this.error = undefined;
                }
                
                //return this.recordsToDisplay; 
    
    //console.log('ssssssss'+filtered);
            })
            
        .catch(error=>{
            alert('Error>>>>>>>>>>>>'+ JSON.stringify(error))
            this.loaded = false;
            this.error = error; //.body.message;
        
        })

       //}*/
        
    
    }

    get groupedData() {

        const grouped = this.data.reduce((acc, obj) => {
            //alert(1);
            const key = obj.AccountName;
            if (!acc[key]) {
                acc[key] = {
                    AccountName: key,   
                    oppdata: []
                 
                };
            }
            
            acc[key].oppdata.push(obj);
            
             
          
            return acc;
        }, {});
          

        this.loaded = false;
        //this.AccountCount = 33;
        const a=  Object.keys(grouped).length;
        
        this.total = true;
        console.log('accountvalue'+this.AccountCount);
        console.log('Groupdata@@@@@@'+JSON.stringify(grouped));
        
        this.displayrec = Object.values(grouped);
        console.log('displayrec length=================='+ this.displayrec.length);
        this.totalRecords = this.displayrec.length;
        console.log('Update total record variable =================='+ this.totalRecords);
        
        //console.log('opportunity length=================='+ (this.displayrec.opportunityName).length);
        
        this.paginationHelper();
        return this.recordsToDisplay;
       
    }

    /*accountsize(){
          const keyCount = Object.keys(grouped).length;
          this.AccountCount = keyCount;


    }*/
    
    showtemplate(){
        console.log('showtemplate');
        this.isfilter = true;
        
    }
    hideModalBox(){
        console.log('hidemodalBox');
        this.isfilter = false;

    }

    value = 'inProgress';

    

    handleChange(event) {
        this.value = event.detail.value;
    }

    exportData(){
        // Prepare a html table
        console.log('ppapapap==='+this.recordtype)
        if(this.recordtype == 'Infinity'){
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
                   
        doc += '<th>'+ 'Account Name' +'</th>';
        doc += '<th>'+ 'City' +'</th>';
        doc += '<th>'+ 'Project Code' +'</th>';
        doc += '<th>'+ 'opportunity Name' +'</th>';
        doc += '<th>'+ 'Segment' +'</th>';
        doc += '<th>'+ 'opportunity Stage' +'</th>';
        doc += '<th>'+ 'opportunity Region' +'</th>';
        doc += '<th>'+ 'Infinity SalesArea' +'</th>';
        doc += '<th>'+ 'Product' +'</th>';
        doc += '<th>'+ 'TotalEstimated Quantity' +'</th>';
        doc += '<th>'+ 'Appropriated Quantity' +'</th>';
        doc += '<th>'+ 'ForecastDate' +'</th>';
        doc += '</tr>';
        // Add the data rows
        this.data.forEach(record => {
            
            doc += '<tr>';
            doc += '<th>'+record.AccountName+'</th>';
            doc += '<th>'+record.City+'</th>';
            doc += '<th>'+record.ProjectCode+'</th>';
            doc += '<th>'+record.opportunityName+'</th>'; 
            doc += '<th>'+record.Segment+'</th>';
            doc += '<th>'+record.Stage+'</th>';
            doc += '<th>'+record.opportunityRegion+'</th>';
            doc += '<th>'+record.InfinitySalesArea+'</th>';
            doc += '<th>'+record.ProductName+'</th>';
            doc += '<th>'+record.TotalEstimatedQuantity+'</th>';
            doc += '<th>'+record.AppropriatedQuantity+'</th>';
            doc += '<th>'+record.ForecastDate+'</th>';
            
            
            doc += '</tr>';
        });
        doc += '</table>';
    
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Adequacy With Glassicon.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click(); 
    
      }else if(this.recordtype == 'Inspire'){
    
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
                   
            doc += '<th>'+ 'Account Name' +'</th>';
            doc += '<th>'+ 'City' +'</th>';
            doc += '<th>'+ 'Project Code' +'</th>';
            doc += '<th>'+ 'opportunity Name' +'</th>';
            doc += '<th>'+ 'Segment' +'</th>';
            doc += '<th>'+ 'opportunity Stage' +'</th>';
            doc += '<th>'+ 'opportunity Region' +'</th>';
            doc += '<th>'+ 'Inspire SalesArea' +'</th>';
            doc += '<th>'+ 'Product' +'</th>';
            doc += '<th>'+ 'TotalEstimated Quantity' +'</th>';
            doc += '<th>'+ 'Appropriated Quantity' +'</th>';
            doc += '<th>'+ 'ForecastDate' +'</th>';
            
        doc += '</tr>';
        // Add the data rows
        this.data.forEach(record => {
            
            doc += '<tr>';
            doc += '<th>'+record.AccountName+'</th>';
            doc += '<th>'+record.City+'</th>';
            doc += '<th>'+record.ProjectCode+'</th>';
            doc += '<th>'+record.opportunityName+'</th>'; 
            doc += '<th>'+record.Segment+'</th>';
            doc += '<th>'+record.Stage+'</th>';
            doc += '<th>'+record.opportunityRegion+'</th>';
            doc += '<th>'+record.InspireSalesArea+'</th>';
            doc += '<th>'+record.ProductName+'</th>';
            doc += '<th>'+record.TotalEstimatedQuantity+'</th>';
            doc += '<th>'+record.AppropriatedQuantity+'</th>';
            doc += '<th>'+record.ForecastDate+'</th>';
            
            
            doc += '</tr>';
        });
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Adequacy With Glassicon.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click(); 
        }
      }

      /*handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }*/
    previousPage() {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>previousPage');
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>nextPage');
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        console.log('recordsToDisplay+++++++++++++++++++++++++'+ this.recordsToDisplay);
        // calculate total pages
        console.log('calculate the total pages check the TOTAL Records'+ this.totalRecords);
        console.log('calculate the total pages check the PAGE SIZE'+ this.pageSize);
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        console.log('totalPages==========================='+ this.totalPages);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.displayrec[i]);
            console.log('length of record to display================================='+ this.recordsToDisplay.length);
            console.log('records to display=========================='+ JSON.stringify(this.recordsToDisplay));
            console.log('length of the JSON>>>>>>>>>>>'+ this.keysArray)
             // Output: 5


        }
    }
    
    missedAccounts(){
       // alert('this.AccoundIdsList>>>>>>>>>>>'+ this.AccoundIdsList);
        //alert('this.AccoundIdsList>>>>>>>>>>>'+ this.AccoundIdsList.length);
        missedacc({AccountIds :this.AccoundIdsList})
        .then((result) => {
          console.log('Data of Accountsss', JSON.stringify(result));
         this.data = result;
         console.log(result,"result")
         this.exportAccountData()
         //alert(this.data.length);
         //alert(2);
          //this.contactData = JSON.parse(jsonString);
           // Push the single record into the array

        })
        .catch((error) => {
          this.error = error;
        });

    }
       
    
    exportAccountData(){
        // Prepare a html table
        //alert(1);
        
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers

        doc += '<tr>';
            doc += '<th>'+ 'Account Id' +'</th>';
            doc += '<th>'+ 'Account Name' +'</th>';
            doc += '<th>'+ 'City' +'</th>';
            doc += '<th>'+ 'Type' +'</th>';
            doc += '<th>'+ 'Sales Area'+ '<th/>';
        doc += '</tr>';
        /*this.columnHeader.forEach(element => {            
            doc += '<th>'+ element +'</th>'           
        });
        doc += '</tr>';*/
        // Add the data rows
        //alert(JSON.stringify(this.data))
        this.data.forEach(record => {
            doc += '<tr>';
            doc += '<th>'+record.Id+'</th>'; 
            doc += '<th>'+record.Name+'</th>';
            doc += '<th>'+record.City_Name__c+'</th>';
            doc += '<th>'+record.Type+'</th>'; 
            doc += '<th>'+record.Sales_Area__c+'</th>';
             
            doc += '</tr>';
        });
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Account Data.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
}
