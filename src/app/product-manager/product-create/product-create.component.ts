import { ProductService } from '../product.service';
import { ConfigurationService } from '../../shared/service/configuration.service';
import { SecurityService } from '../../shared/service/security.service';
import { IProductForm, ISkuForm } from '../../shared/models/createProductForm.model';
import { IImage } from '../../shared/models/image.model';
import { FormArray } from '@angular/forms';
import { AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  param: any;
  productForm: ProductFormGroup;
  public Editor = ClassicEditor;
  constructor(
    private route: ActivatedRoute,
    private service: ProductService,
    private configurationService: ConfigurationService,
    private formBuilder: FormBuilder,
    private securityService: SecurityService
  ) {
    
  }

  ngOnInit() {
    if(this.configurationService.isReady){
      this.loadData();
    } else {
      this.configurationService.settingLoaded$.subscribe(x=>{
        this.loadData();
      })
    }
  }

  loadData(){
      this.loadNewProductForm();
  }

  loadNewProductForm(){
    this.productForm = new ProductFormGroup({
      productName: new FormControl(null, [Validators.required]),
      primaryCategory: new FormControl("6371", []),
      brand: new FormControl('No Brand', []),
      description: new FormControl(null, []),
      sizes: new SizesFormArray(null, [], []),
      colors: new ColorFormArray(null, [], []),
      skus: new SkusFormArray(null, []),
      weight: new FormControl(0, []),
      length: new FormControl(0, []),
      width: new FormControl(0, []),
      height: new FormControl(0, [])
    })
  }

  saveProduct() {
    let product = this.commitProductForm() as IProductForm;
    console.log(product);
    console.log(this.productForm);
    this.createNewProduct(product);
  }

  createNewProduct(product: IProductForm) {
    const productRequest = {product:{...product}};
    this.service.createProduct(productRequest).subscribe({
      next: (res: any) => { console.log('create product', res); alert("create success") },
    });
  }

  commitProductForm(): IProductForm {
    let skus = this.productForm.get('skus') as SkusFormArray;
    this.productForm.patchValue({skus: [...skus.controls.values()]});

    let product: IProductForm = {
      primaryCategory: this.productForm.categoryValue,
    attributes: {
      name: this.productForm.productName.value,
      brand: this.productForm.brandValue,
      description: this.productForm.get('description').value
     },
    skus : this.productForm.get('skus').value,
    };
    product.skus.forEach(sku=>{
      sku.packageWeight = this.productForm.weightValue;
      sku.packageLength = this.productForm.lengthValue;
      sku.packageWidth = this.productForm.widthValue
      sku.packageHeight = this.productForm.heightValue;
      sku.images = this.productForm.getImageValuesByColor(sku.colorFamily);
    })
    console.log(product);
    return product;
  }
}

class ProductFormGroup extends FormGroup {
  constructor(
    controls: { [key: string]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    console.log(this.skus);
    console.log(this.sizes);
  }

  newSize(): FormControl {
    return new FormControl('30', [Validators.required, Validators.min(0), Validators.pattern('\\d+')]);
  }

  addSize() {
    this.sizes.push(this.newSize());
    console.log(this.sizes);
  }

  removeSize(i: number) {
    this.sizes.removeAt(i);
  }

  newColor():FormGroup{
    return new FormGroup({
      colorFamily: new FormControl('color', Validators.required),
      images: new ImageFormArray([], [])
    });
  }

  addColor(){
    this.colors.push(this.newColor());
  }

  removeColor(i:number){
    this.colors.removeAt(i);
  }

  newSku():FormGroup{
    return new FormGroup({
      colorFamily: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('\\w+')]),
        size: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('\\d+')]),
        price: new FormControl(0, [Validators.required, Validators.min(1), Validators.pattern('\\d+')]),
        quantity: new FormControl(0, []),
        sellerSku: new FormControl('', [])
    });
  }

  addSku(){
    this.skus.push(this.newSku());
  }

  removeSku(i:number){
    this.skus.removeAt(i);
  }

  getImageValuesByColor(color: string): string[] {
    let images: string[] = [];
    let colorsFormArray = this.get("colors") as FormArray;
    console.log(colorsFormArray);
    for (let i = 0; i < colorsFormArray.controls.length; i++) {
      if (colorsFormArray.controls[i].get('colorFamily').value == color) {
        let imagesFormArray = colorsFormArray.controls[i].get('images') as FormArray;
        console.log(imagesFormArray);
        imagesFormArray.controls.forEach(imageFormGroup => {
          let imageObj = imageFormGroup.value;
          delete imageObj.file;
          images.push(imageObj.url.replace(/^data:image\/[a-z]+;base64,/, ""));
        })        
      }
    }
    return images;
  }

  get productName(): FormControl {
    return this.get("productName") as FormControl;
  }

  get sizes(): FormArray {
    return this.get("sizes") as FormArray;
  }

  get colors(): FormArray {
    return this.get("colors") as FormArray;
  }

  get colorValues(): string[]{
    let colors = this.get("colors").value;
    colors =  colors.map(colorObj => {
      return colorObj.colorFamily;
    })
    return colors;
  }

  get skus(): FormArray {
    return this.get("skus") as FormArray;
  }

  get idValue(): number {
    return Number(this.get('id').value);
  }

  get brandValue(): string {
    return this.get('brand').value;
  }

  get categoryValue():string{
    return this.get('primaryCategory').value;
  }

  get weightValue(): string{
    return this.get('weight').value;
  }

  get heightValue(): string{
    return this.get('height').value;
  }

  get lengthValue(): string{
    return this.get('length').value;
  }

  get widthValue():string {
    return this.get('width').value;
  }

}

class SizesFormArray extends FormArray {
  constructor(
    skus: ISkuForm[],
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    controls.push(...this.generateFormControl(this.extractSizeFromSku(skus)));
  }

  extractSizeFromSku(skus: ISkuForm[]): string[] {
    let sizes: string[] = [];
    if(skus != null)
    skus.forEach(sku => {
      if (!sizes.includes(String(sku.size))) {
        sizes.push(String(sku.size));
      }
    })
    return sizes;
  }

  generateFormControl(data: string[]): FormControl[] {
    console.log(data);
    let formControls: FormControl[] = [];
    data.forEach(item => {
      formControls.push(new FormControl(item, [Validators.required, Validators.min(0), Validators.pattern('\\d+')]));
    })
    return formControls;
  }
}

class ColorFormArray extends FormArray {
  constructor(
    skus: ISkuForm[],
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    controls.push(...this.generateFormGroup(this.extractColorFromSku(skus)));
  }

  generateFormGroup(data: any[]): FormGroup[] {
    let formGroups: FormGroup[] = [];
    data.forEach(item => {
      formGroups.push(new FormGroup({
        color: new FormControl(item.color, [Validators.required]),
        images: new ImageFormArray(item.images, [])
      }, []));
    })
    return formGroups;
  }

  extractColorFromSku(skus: ISkuForm[]) {
    let colors: {color:string, images: any[] }[] = [];
    if(skus!=null)
    skus.forEach(sku=>{
      let flag = true;
      colors.forEach(colorItem=>{
        if(colorItem.color == sku.colorFamily){
          flag = false;
        }
      })
      if(flag){
        colors.push({color: sku.colorFamily, images: sku.images });
      }
    })
    return colors;
  }

}

class ImageFormArray extends FormArray {
   constructor(
    images: IImage[],
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[],
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    controls.push(...this.generateFormControl(images));
  }

  generateFormControl(images: IImage[]): AbstractControl[] {
    let formGroups: FormGroup[] = [];
    console.log(images);
    images.forEach(imageObj => {
      formGroups.push(new FormGroup({
        id: new FormControl(imageObj.id),
        url: new FormControl(imageObj.url, [Validators.required]),
        file: new FormControl(null),
        skuId: new FormControl(imageObj.skuId)
      }))
    })
    return formGroups;
  }

  //Update image
  showPreview(event, index:number){
    const file = (event.target as HTMLInputElement).files[0];
    this.controls[index].patchValue({
      file: file
    })
    this.controls[index].get('file').updateValueAndValidity();

    //File preview
    const reader = new FileReader();
    reader.onload = () =>{
      this.controls[index]
        .patchValue({
          url: reader.result as string
        })
    }
    reader.readAsDataURL(file);
  }

  newImage():FormGroup{
    return new FormGroup({
       id: new FormControl(0),
       url: new FormControl(null),
       file: new FormControl(null),
       skuId: new FormControl(0)
    }, [])
  }

  addImage(){
    this.controls.push(this.newImage());
  }

  removeImage(i:number){
    this.controls.splice(i, 1);
  }
}

class SkusFormArray extends FormArray {
   constructor(
    skus: ISkuForm[],
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
    controls.push(...this.generateFormGroup(skus));
  }

  generateFormGroup(skus:ISkuForm[]):FormGroup[]{
    let formGroups:FormGroup[] = [];
    if(skus != null)
    skus.forEach(sku=>{
      formGroups.push(new FormGroup({
        colorFamily: new FormControl(sku.colorFamily, [Validators.required, Validators.pattern('\\w+')]),
        size: new FormControl(sku.size, [Validators.required, Validators.min(1), Validators.pattern('\\d+')]),
        price: new FormControl(sku.price, [Validators.required, Validators.min(1), Validators.pattern('\\d+')]),
        quantity: new FormControl(sku.quantity, [Validators.required, Validators.min(0), Validators.pattern('\\d+')]),
        sellerSku: new FormControl(sku.sellerSku, [])
      },[]));
    })
    return formGroups;
  }
}
