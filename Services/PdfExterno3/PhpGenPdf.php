<?php

namespace Design\DesignBundle\Services\PdfExterno3;

use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfRecordSet as RecordSet;
use jpgraph\src;

if (!defined("_EBarra")) {
    define("_EBarra", "/");
}

class PhpGenPdf {
    public static $returnInBase64 = false;
    //--------------------------------------------------------------------------
    protected $isUtf8 = true;
    public $objExtraSection=null;
    //--------------------------------------------------------------------------
    protected $dirRoot;
    protected $dirSalida=null;
    protected $Data;

    /** @var fpdf */
    protected $pdf;
    //--------------------------------------------------------------------------
    protected $reg;
    protected $estruc;
    //--------------------------------------------------------------------------
    protected $idata = -1;
    protected $dataEof = false;
    protected $group = "";
    protected $groupAux = "";
    protected $groupIgual = true;
    protected $pageEstruc;
    protected $pageDocum;
    protected $NameReportSal = "";
    protected $totalFieldRef = array();
    protected $tituloDefine  = null;
    public function setTituloDefine($tituloDefine=null) {
        $this->tituloDefine = $tituloDefine;
    }
    public function getTitulos() {
        return $this->tituloDefine;
    }
    //--------------------------------------------------------------------------
    /** @var RecordSet */
    protected $RecordSet = "";
    public $Fagre = array();
    public $SaltaApagina = 0;
    public function setIsUtf8($isUtf8){
        $this->isUtf8=$isUtf8;
    }
    public function getIsUtf8(){
        return $this->isUtf8;
    }
    //--------------------------------------------------------------------------
    protected function printPdfTable($obj, $top = 0, $left = 0) {
        $objRef = (object) array();

        if (!isset($obj->TableRow->isProcesRow)) {
            $obj->TableRow->isProcesRow = true;
            foreach ($obj->TableRow->items as $k => $v) {
                if (trim($v->SourceCode->name) != "") {
                    //----------------------------------------------------------
                    $fun = $v->SourceCode->name;
                    $v->SourceCode->runf = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
                    //----------------------------------------------------------
                }
            }
        }

        if (!isset($obj->TableFoot->isProcesRow)) {
            $obj->TableFoot->isProcesRow = true;
            foreach ($obj->TableFoot->items as $k => $v) {
                if (trim($v->SourceCode->name) != "") {
                    //----------------------------------------------------------
                    $fun = $v->SourceCode->name;
                    $v->SourceCode->runf = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
                    //----------------------------------------------------------
                }
            }
        }

        if (!isset($obj->isProcesHead)) {
            if (trim($obj->PrintHead->name) != "") {
                //--------------------------------------------------------------
                $fun = $obj->PrintHead->name;
                $obj->isProcesHead = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
                //--------------------------------------------------------------
            }
        }
        if (!isset($obj->isProcesaFoot)) {
            if (trim($obj->ProcesaFoot->name) != "") {
                //----------------------------------------------------------
                $fun = $obj->ProcesaFoot->name;
                $obj->isProcesaFoot = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
                //----------------------------------------------------------
            }
        }

        if (!isset($obj->TableHead->isProcesRow)) {
            $obj->TableHead->isProcesRow = true;
            foreach ($obj->TableHead->items as $k => $v) {
                if (trim($v->SourceCode->name) != "") {
                    //----------------------------------------------------------
                    $fun = $v->SourceCode->name;
                    $v->SourceCode->runf = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
                    //----------------------------------------------------------
                }
            }
        }


        //----------------------------------------------------------------------
        if (!isset($obj->runIf)) {
            $obj->runIf = (object) array();
        }
        if (isset($obj->TableInit)) {
            if (trim($obj->TableInit->name) != "") {
                $fun = $obj->TableInit->name;
                $obj->runIf->Init = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
            }
        }
        if (isset($obj->TableAfterRead)) {
            if (trim($obj->TableAfterRead->name) != "") {
                $fun = $obj->TableAfterRead->name;
                $obj->runIf->AfterRead = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
            }
        }
        if (isset($obj->TableBeforeRead)) {
            if (trim($obj->TableBeforeRead->name) != "") {
                $fun = $obj->TableBeforeRead->name;
                $obj->runIf->BeforeRead = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
            }
        }
        if (isset($obj->TableFinishRead)) {
            if (trim($obj->TableFinishRead->name) != "") {
                $fun = $obj->TableFinishRead->name;
                $obj->runIf->FinishRead = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
            }
        }
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $columns = array();
        $dat = array();
        $regGene = $this->getRegistro();
        //----------------------------------------------------------------------
        $this->pdf->SetXY($obj->PositionLeft + $left, $obj->PositionTop + $top);
        //----------------------------------------------------------------------
        if (isset($obj->runIf->Init)) {
            $runf = $obj->runIf->Init;
            $title = $runf($this, $regGene, null, $obj, $objRef);
        }

        if ($rs = $this->getSource($obj, $regGene, $objRef)) {
            $reg = $rs->getRegistro(false);
        } else {
            return $this->pdf->GetY();
        }
        //falta: borrar este comentario
        /*
          if ($obj->Sources->sourceName == 1) {
          if ($obj->Sources->code == "") {
          return false;
          }
          //            $a = $regGene["cuota"];
          //            $b = GJson::decode($a);

          $fun = $obj->Sources->code;
          $ff = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
          if (isset($obj->runIf->BeforeRead)) {
          $runf = $obj->runIf->BeforeRead;
          $title = $runf($this, $regGene, null, $obj, $objRef);
          }

          $rs = new PdfGenLeoRecordTable($ff($this, $regGene, null, $obj, $objRef));
          $reg = $rs->next(false);
          if ($reg == false) {
          if ($obj->PrintIfEmpyReg == false) {
          return $this->pdf->GetY();
          }
          }
          //-code
          } else {
          if ($obj->Sources->sourceName == 2) {
          //-sql
          $ssql = $obj->Sources->sql;
          if (is_array($obj->Sources->params)) {
          foreach ($obj->Sources->params as $k => $v) {
          $ssql = str_replace("{" . $v->name . "}", $regGene[$v->name], $ssql);
          }
          }

          //                $rs = new RecordSet($obj->Sources->sql);
          $rs = new RecordSet($ssql);
          if (isset($obj->runIf->BeforeRead)) {
          $runf = $obj->runIf->BeforeRead;
          $title = $runf($this, $regGene, null, $obj, $objRef);
          }

          $reg = $rs->next(false);
          if ($reg == false) {
          if ($obj->PrintIfEmpyReg == false) {
          return $this->pdf->GetY();
          }
          }
          }
          } */
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $procHead = true;
        if (isset($obj->isProcesHead)) {
            $a = $obj->isProcesHead;
            $procHead = $a($this, $regGene, $reg, $obj, $objRef);
        }
        if ($procHead) {
            foreach ($obj->TableHead->items as $k => $v) {
                //--------------------------------------------------------------
                $style = "";
                //--------------------------------------------------------------
                if ($v->FontBold) {
                    $style .="B";
                }
                if ($v->FontItalic) {
                    $style .="I";
                }
                if ($v->FontUnderLine) {
                    $style .="U";
                }
                //--------------------------------------------------------------
                $title = $v->Title;
                if (isset($v->SourceCode->runf)) {
                    $runf = $v->SourceCode->runf;
                    $title = $runf($this, $regGene, $reg, $obj, $objRef);
                }
                $dat[] = array(
                    'text' => $title,
                    'width' => $v->PositionWidth,
                    'height' => $obj->TableHeightH,
                    'align' => strtoupper(substr($v->FontAlign, 0, 1)),
                    'font_name' => $v->FontFamily,
                    'font_size' => $v->FontSize,
                    'font_style' => $style,
                    'fillcolor' => $v->FillColorRow->R . "," . $v->FillColorRow->G . "," . $v->FillColorRow->B,
                    'textcolor' => $v->FontColor->R . "," . $v->FontColor->G . "," . $v->FontColor->B,
                    'drawcolor' => $v->BorderColor->R . "," . $v->BorderColor->G . "," . $v->BorderColor->B,
                    'linewidth' => $v->BorderSize / 10,
                    'linearea' => strtoupper($v->BorderType->type)
                );
                //--------------------------------------------------------------
            }
        }
        //----------------------------------------------------------------------
        $columns[] = $dat;
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        if ($reg != false) {
            do {
                if (isset($obj->runIf->AfterRead)) {
                    $runf = $obj->runIf->AfterRead;
                    $title = $runf($this, $regGene, $reg, $obj, $objRef);
                }
                $dat = array();
                foreach ($obj->TableRow->items as $k => $v) {
                    $style = "";
                    //----------------------------------------------------------
                    if ($v->FontBold) {
                        $style .="B";
                    }
                    if ($v->FontItalic) {
                        $style .="I";
                    }
                    if ($v->FontUnderLine) {
                        $style .="U";
                    }
                    //----------------------------------------------------------
                    $text = "source no Seteado";
                    if (isset($v->SourceCode->runf)) {
                        $runf = $v->SourceCode->runf;
                        $text = $runf($this, $regGene, $reg, $obj, $objRef);
                    } else {
                        if ($v->SourceName != "") {
                            if (isset($reg[$v->SourceName->name])) {
                                $text = $reg[$v->SourceName->name];
                            }
                        }
                        $text = $this->pdfFormat($v, $text);
                    }
                    $dat[] = array(
                        'text' => $text,
                        'width' => $obj->TableHead->items->$k->PositionWidth,
                        'height' => $obj->TableHeightR,
                        'align' => strtoupper(substr($v->FontAlign, 0, 1)),
                        'font_name' => $v->FontFamily,
                        'font_size' => $v->FontSize,
                        'font_style' => $style,
                        'fillcolor' => $v->FillColorRow->R . "," . $v->FillColorRow->G . "," . $v->FillColorRow->B,
                        'textcolor' => $v->FontColor->R . "," . $v->FontColor->G . "," . $v->FontColor->B,
                        'drawcolor' => $v->BorderColor->R . "," . $v->BorderColor->G . "," . $v->BorderColor->B,
                        'linewidth' => $v->BorderSize / 10,
                        'linearea' => strtoupper($v->BorderType->type)
                    );
                }
                $columns[] = $dat;
            } while ($reg = $rs->next(false));
        }
        $procFoot = true;
        if (isset($obj->isProcesaFoot)) {
            $a = $obj->isProcesaFoot;
            $procFoot = $a($this, $regGene, $reg, $obj, $objRef);
        }
        if ($procFoot) {
            $dat = array();
            foreach ($obj->TableFoot->items as $k => $v) {
                $style = "";
                //----------------------------------------------------------
                if ($v->FontBold) {
                    $style .="B";
                }
                if ($v->FontItalic) {
                    $style .="I";
                }
                if ($v->FontUnderLine) {
                    $style .="U";
                }
                //----------------------------------------------------------
                $text = "source no Seteado";
                if (isset($v->SourceCode->runf)) {
                    $runf = $v->SourceCode->runf;
                    $text = $runf($this, $regGene, $reg, $obj, $objRef);
                } else {
                    if (isset($reg[$v->SourceName->name])) {
                        $text = $reg[$v->SourceName->name];
                    }
                    $text = $this->pdfFormat($v, $text);
                }
                $dat[] = array(
                    'text' => $text,
                    //'width'     => $obj->TableHead->items->$k->PositionWidth,
                    'width' => $v->PositionWidth,
                    'height' => $obj->TableHeightF,
                    'align' => strtoupper(substr($v->FontAlign, 0, 1)),
                    'font_name' => $v->FontFamily,
                    'font_size' => $v->FontSize,
                    'font_style' => $style,
                    'fillcolor' => $v->FillColorRow->R . "," . $v->FillColorRow->G . "," . $v->FillColorRow->B,
                    'textcolor' => $v->FontColor->R . "," . $v->FontColor->G . "," . $v->FontColor->B,
                    'drawcolor' => $v->BorderColor->R . "," . $v->BorderColor->G . "," . $v->BorderColor->B,
                    'linewidth' => $v->BorderSize / 10,
                    'linearea' => strtoupper($v->BorderType->type)
                );
            }
            $columns[] = $dat;
        }
        //----------------------------------------------------------------------
        if (isset($obj->runIf->FinishRead)) {
            $runf = $obj->runIf->FinishRead;
            $title = $runf($this, $regGene, null, $obj, $objRef);
        }
        //----------------------------------------------------------------------
        $this->pdf->WriteTable($columns);
        return $this->pdf->GetY();
    }

    //--------------------------------------------------------------------------
    protected function printPdfLabel($obj, $text, $top = 0, $left = 0) {
        //----------------------------------------------------------------------
        $saltaPage = false;
        $pdf = $this->getPdf();
        $this->setPageIfSalt($obj, $top, $left);
        //$this->saltoSet($obj, $pdf, $top, $left);
        //----------------------------------------------------------------------
        $this->pdf->SetTextColor($obj->FontColor->R, $obj->FontColor->G, $obj->FontColor->B);
        //----------------------------------------------------------------------
        $style = "";
        //----------------------------------------------------------------------
        if ($obj->FontBold) {
            $style .="B";
        }
        if ($obj->FontItalic) {
            $style .="I";
        }
        if ($obj->FontUnderLine) {
            $style .="U";
        }
        //----------------------------------------------------------------------
        $this->pdf->SetFont($obj->FontFamily, $style, $obj->FontSize);
        //----------------------------------------------------------------------
        if ($obj->BorderType->type != "") {
            $this->pdf->SetDrawColor($obj->BorderColor->R, $obj->BorderColor->G, $obj->BorderColor->B);
            $this->pdf->SetLineWidth($obj->BorderSize / 10);
        }
        //----------------------------------------------------------------------
        $fill = true;
        $this->pdf->SetFillColor($obj->BackGround->R, $obj->BackGround->G, $obj->BackGround->B);
        //----------------------------------------------------------------------
        $roto=false;
        if ( isset($obj->LabelRotacion) ){
            $rota=(int)substr($obj->LabelRotacion, -2);
            if ( $rota>0){
                $pdf->StartTransform();
                $this->pdf->SetY($this->pdf->GetY()+  $obj->PositionWidth );
                $this->pdf->SetX($this->pdf->GetX()+ $obj->PositionLeft );
                $this->pdf->Rotate(90);//,$this->pdf->GetX(),$this->pdf->GetY());
                $roto=true;
            }
        }
        $auxX = $this->pdf->GetX();
        $auxY = $this->pdf->GetY();
        if (isset($obj->CodigoBarra) ) {
            if ( $obj->CodigoBarra > 0 ) {
                $textCb = $text;
                $text="";
            }
        }
        $conCodigo=false;
        if (isset($obj->CodigoBarra) ) {
            if ( $obj->CodigoBarra > 0 ) {
                $this->pdf->SetFillColor(0,0,0);
                $auxNX= $this->pdf->Code39($auxX  ,$auxY,$textCb,true,false,0.6,$obj->PositionHeight );
                $wN= $auxX - $this->pdf->getX();
                $wN= $auxNX -$auxX + 4;
                $conCodigo=true;
            }
        }

        if ($obj->MultiLine == false) {
            if ($obj->FontAlign == "J") {
                $obj->FontAlign = "L";
            }
            $fill = ($obj->BackGround->R == "999" && $obj->BackGround->G == "999" && $obj->BackGround->B == "999" ) ? false : true;

            $this->pdf->Cell($conCodigo?$wN:$obj->PositionWidth, $obj->PositionHeight, $text, strtoupper($obj->BorderType->type), 0, substr($obj->FontAlign, 0, 1), $fill, $saltaPage);
            $this->pdf->SetY($this->pdf->GetY() + $obj->PositionHeight);
        } else {
            $fill = ($obj->BackGround->R == "999" && $obj->BackGround->G == "999" && $obj->BackGround->B == "999" ) ? false : true;
            $this->pdf->MultiCell($obj->PositionWidth, $obj->PositionHeight, $text, strtoupper($obj->BorderType->type), substr($obj->FontAlign, 0, 1), $fill);
            $this->pdf->SetY($this->pdf->GetY()); //+ $obj->Position->Height);
        }
        
        
        if ($roto==true){
            //$this->pdf->_out('Q');
            //$this->pdf->Rotate(0);
            $pdf->StopTransform();

        }
        
        
        //----------------------------------------------------------------------
        return $this->pdf->GetY();
        //----------------------------------------------------------------------
    }

    protected function printPdfImagen($obj, $top = 0, $left = 0) {
        //----------------------------------------------------------------------
        $f = str_replace("/", _EBarra, $obj->fileName);
        //$path = "web" . _EBarra . "img" . _EBarra . "report" . _EBarra . $f;
        $path = "bundles" . _EBarra . $f;
        //----------------------------------------------------------------------
        $this->pdf->SetXY($obj->PositionLeft + $left, $obj->PositionTop + $top);
        
        
        $roto=false;
        if ( isset($obj->LabelRotacion) ){
            $rota=(int)substr($obj->LabelRotacion, -2);
            if ( $rota>0){
                $this->pdf->SetY($this->pdf->GetY()+  $obj->PositionWidth );
                $this->pdf->SetX($this->pdf->GetX()+ $obj->PositionLeft );
                $this->pdf->Rotate(90);//,$this->pdf->GetX(),$this->pdf->GetY());
                $roto=true;
            }
        }
        
        
        $this->pdf->Image($this->getDirRoot() . $path, null, null, $obj->PositionWidth, $obj->PositionHeight, $obj->TypeImagen);
        //----------------------------------------------------------------------
        if ($roto==true){
            $this->pdf->Rotate(0);
            //$this->pdf->_out('Q');
        }
        return $this->pdf->getY();
        //----------------------------------------------------------------------
    }
    protected function printPdfLine($obj, $top, $left) {
        //----------------------------------------------------------------------
        $this->pdf->SetDrawColor($obj->Color->R, $obj->Color->G, $obj->Color->B);
        //----------------------------------------------------------------------
        $this->pdf->SetLineWidth($obj->Width);
        //----------------------------------------------------------------------
        $this->pdf->line($obj->X1 + $left, $obj->Y1 + $top, $obj->X2 + $left, $obj->Y2 + $top);
        //----------------------------------------------------------------------
        if ($obj->Y2 + $top > $obj->Y1 + $top) {
            return $obj->Y2 + $top;
        } else {
            return $obj->Y1 + $top;
        }
        //----------------------------------------------------------------------
    }
    public $_print_in_formula=false;
    public function printCodeBarra($obj, $top, $left){
        $this->setPageIfSalt($obj, $top, $left);
        $this->pdf->Code39($this->pdf->GetX(), $this->pdf->GetY(),$obj->Text);
    }
    //--------------------------------------------------------------------------
    public function pdfPrintObject($obj, $top, $left) {
        switch (strtoupper($obj->TypeObj)) {
            case "S";
                return $this->printPdfTable($obj, $top, $left);
                break;
            case "L":
                return $this->printPdfLabel($obj, $obj->Text, $top, $left);
                break;
            case "F":
                $obj->datasource = $obj->DataSource->name;
                if (isset($this->reg[$obj->datasource])) {
                    $f = $this->reg[$obj->datasource];
                    $f = $this->pdfFormat($obj, $f);
                } else {
                    if ($obj->datasource != "") {
                        if (is_null($this->reg[$obj->datasource])) {
                            $f = "";
                        } else {
                            $f = "NoSeteado Error";
                        }
                    } else {
                        $f = "NoSeteado Error";
                    }
                }
                return $this->printPdfLabel($obj, $f, $top, $left);
                break;
            case "X":
                return $this->printPdfLine($obj, $top, $left);
                break;
            case "P":
                return $this->printPdfImagen($obj, $top, $left);
                break;
            case "T":
                //$obj
                $nn = $obj->TotalFieldName;
                $ob = $this->totalFieldRef->$nn;
                //if ($obj->Type == "Avg") {
                if ($ob->Type == "Avg") {
                    //$avg = $this->Fagre[$obj->FieldName] / $this->Fagre["@" . $obj->FieldName];
                    $avg = $this->Fagre[$obj->TotalFieldName] / $this->Fagre["@" . $obj->TotalFieldName];
                    $avg = $this->pdfFormat($obj, $avg);
                    return $this->printPdfLabel($obj, $avg, $top, $left);
                } else {
                    //if ($obj->Type == "Formula") {
                    if ($ob->Type == "Formula") {
                        try {
                            //$f = $this->FunctionVuelo[$obj->FieldName]($this->reg, $this->Fagre, $this); //$this->Fagre[$obj->FieldName];
                            $this->_print_in_formula = false;
                            $f = $this->FunctionVuelo[$obj->TotalFieldName]($this->reg, $this->Fagre, $this,$obj); //$this->Fagre[$obj->FieldName];
                            $f = $this->pdfFormat($obj, $f);
                            if ( $this->_print_in_formula == true ) {
                                if ( is_numeric($f) ) {
                                    return $f;
                                }else{
                                    return $this->getPdf()->getY();
                                }
                            } else {
                                return $this->printPdfLabel($obj, $f, $top, $left);
                            }
                        } catch (Exceptions $e) {
                            print_r($e);
                        }
                    } else {
                        $f = $this->Fagre[$obj->TotalFieldName];
                        //$f = $this->Fagre[$obj->FieldName];
                        $f = $this->pdfFormat($obj, $f);
                        return $this->printPdfLabel($obj, $f, $top, $left);
                    }
                    //	return $this->printPdfLabel($obj,$this->Fagre[$obj->FieldName],$top,$left);
                }
                break;
            case "Told":
                //$obj
                if ($obj->Type == "Avg") {
                    $avg = $this->Fagre[$obj->FieldName] / $this->Fagre["@" . $obj->FieldName];
                    $avg = $this->pdfFormat($obj, $avg);
                    return $this->printPdfLabel($obj, $avg, $top, $left);
                } else {
                    if ($obj->Type == "Formula") {
                        //if ($obj->Type == "formula") {
                        try {
                            $f = $this->FunctionVuelo[$obj->FieldName]($this->reg, $this->Fagre, $this,$obj); //$this->Fagre[$obj->FieldName];
                            $f = $this->pdfFormat($obj, $f);
                            return $this->printPdfLabel($obj, $f, $top, $left);
                        } catch (Exceptions $e) {
                            print_r($e);
                        }
                    } else {
                        $f = $this->Fagre[$obj->FieldName];
                        $f = $this->pdfFormat($obj, $f);
                        return $this->printPdfLabel($obj, $f, $top, $left);
                    }
                    //	return $this->printPdfLabel($obj,$this->Fagre[$obj->FieldName],$top,$left);
                }
                break;
            case "A":
                $pageNro = $this->getPdf()->PageNo();
                $Text = str_replace("##", $pageNro, $obj->Text);
                $Text = str_replace("#", '{nb}', $Text);
                return $this->printPdfLabel($obj, $Text, $top, $left);
                break;
            case "GT":
                return $this->printGraficoTorta($obj, $top, $left);
                break;
        }
    }
    /**
     * 
     * @param type $obj
     * @param type $regGene
     * @param type $objRef
     * @return boolean|\Design\DesignBundle\Services\PdfExterno3\PhpGenPdfRecordSet
     */
    protected function getSource($obj, $regGene, $objRef) {
        if (!isset($obj->runIf)) {
            $obj->runIf = (object) array();
        }
        if ($obj->Sources->sourceName == 1) {
            if ($obj->Sources->code == "") {
                return false;
            }
            //------------------------------------------------------------------
            $fun = $obj->Sources->code;
            $ff = create_function('$GenPdf,$pdfReg,$reg,$row,$obj', $fun);
            //------------------------------------------------------------------
            if (isset($obj->runIf->BeforeRead)) {
                $runf = $obj->runIf->BeforeRead;
                $title = $runf($this, $regGene, null, $obj, $objRef);
            }

            $rs = new PdfGenLeoRecordTable($ff($this, $regGene, null, $obj, $objRef));
            $reg = $rs->next(false);
            if ($reg == false) {
                if ($obj->PrintIfEmpyReg == false) {
                    //return $this->pdf->GetY();
                    return false;
                }
            }
            //-code
        } else {
            if ($obj->Sources->sourceName == 2) {
                //-sql
                $ssql = $obj->Sources->sql;
                if (is_array($obj->Sources->params)) {
                    foreach ($obj->Sources->params as $k => $v) {
                        $ssql = str_replace("{" . $v->name . "}", $regGene[$v->name], $ssql);
                    }
                }
                $rs = new RecordSet($ssql);
                if (isset($obj->runIf->BeforeRead)) {
                    $runf = $obj->runIf->BeforeRead;
                    $title = $runf($this, $regGene, null, $obj, $objRef);
                }

                $reg = $rs->next(false);
                if ($reg == false) {
                    if ($obj->PrintIfEmpyReg == false) {
                        //return $this->pdf->GetY();
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return $rs;
    }

    public function printGraficoTorta($obj, $top, $left) {
        //----------------------------------------------------------------------
        require_once('jpgraph/src/jpgraph.php');
        require_once('jpgraph/src/jpgraph_pie.php');
        require_once ("jpgraph/src/jpgraph_pie3d.php");
        //----------------------------------------------------------------------
        $objRef = (object) array();
        $regGene = $this->getRegistro();
        if ($rs = $this->getSource($obj, $regGene, $objRef)) {
            $reg = $rs->getRegistro(false);
        } else {
            return $this->pdf->GetY();
        }
        $dt = array();
        $ly = array();
        if ($reg != false) {
            do {
                $dt[] = $reg["val"];
                $ly[] = $reg["ley"];
            } while ($reg = $rs->next(false));
        }
        $color = array();
        $x = $left;
        $y = $top;
        //$graph = new \PieGraph($obj->PositionWidth, $obj->PositionHeight);
        $graph = new \PieGraph();
        $graph->title->Set($obj->GrafTitle);
        //Creamos el plot de tipo tarta
        $p1 = new \PiePlot3D($dt);
        //$p1->SetSliceColors($color);
        $p1->SetLegends($ly);
        //Añadirmos el plot al grafico
        $graph->Add($p1);
        //mostramos el grafico en pantalla
        $name = "tmp/gp/" . uniqid(rand(), true) . ".png";
        $gd=$graph->Stroke(_IMG_HANDLER);
        //$gd=$graph->Stroke($name);
        $this->pdf->SetXY($obj->PositionLeft + $left, $obj->PositionTop + $top);
        $this->pdf->GDImage($gd, null, null,$obj->PositionWidth, $obj->PositionHeight);
        //$x= $this->pdf->Image($name, null, null,$obj->PositionWidth, $obj->PositionHeight);
        //unlink($name);
        return $this->pdf->getY();
    }

    //--------------------------------------------------------------------------
    /**  @return FPDF */
    public function getPdf() {
        return $this->pdf;
    }

    /** @return array */
    public function getTotalField() {
        return $this->totalFieldRef;
    }

    //--------------------------------------------------------------------------
    public function setGrupoIgual() {
        $this->groupIgual = true;
    }

    /** @return boolean     */
    public function getGroupIgual() {
        return $this->groupIgual;
    }
    protected $nameReport="";
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    public function __construct($estruc,$titulo=null) {
        $this->setTituloDefine($titulo);
        $this->nameReport = $estruc->reportExtras->name;
        //----------------------------------------------------------------------
        $tieneGrupos = false;
        $this->group = array();
        foreach ($estruc->GroupBy as $k => $v) {
            foreach ($v as $k1 => $v1) {
                $this->group["$v1"] = "$v1";
            }
            $tieneGrupos = true;
        }
        $this->FunctionVuelo = array();
        $this->totalFieldRef = $estruc->TotalFields;
        foreach ($estruc->TotalFields as $k => $v) {
            if ($v->Type == "Formula") {
                $funcion = $v;
                $arr = "";

                preg_match_all('/(([\$][\@|\$])[A-Za-z_0-9]+)/', $funcion->Expression, $arr, PREG_PATTERN_ORDER);
                if (is_array($arr)) {
                    if (is_array($arr[0])) {
                        foreach ($arr[0] as $k => $v) {
                            if (substr($v, 0, 2) == "\$\$") {
                                $funcion->Expression = str_replace($v, "\$Fagre[\"" . substr($v, 2) . "\"]", $funcion->Expression);
                            } else {
                                $funcion->Expression = str_replace($v, "\$pdfReg[\"" . substr($v, 2) . "\"]", $funcion->Expression);
                            }
                        }
                        $this->FunctionVuelo[$funcion->FieldName] = create_function('$pdfReg,$Fagre,$GenPdf,$obj=null', $funcion->Expression);
                    }
                }
            } else {
                $this->Fagre["{$v->FieldName}"] = 0;
            }
        }
        if ($tieneGrupos == false) {
            $this->group = "";
        }
        //----------------------------------------------------------------------
        if (isset($estruc->ExpressionDef)) {
            foreach ($estruc->ExpressionDef as $k => $funcion) {
                $arr = "";

                preg_match_all('/(([\$][\@|\$])[A-Za-z_0-9]+)/', $funcion->Expression, $arr, PREG_PATTERN_ORDER);
                if (is_array($arr)) {
                    if (is_array($arr[0])) {
                        foreach ($arr[0] as $k => $v) {
                            if (substr($v, 0, 2) == "\$\$") {
                                $funcion->Expression = str_replace($v, "\$Fagre[\"" . substr($v, 2) . "\"]", $funcion->Expression);
                            } else {
                                $funcion->Expression = str_replace($v, "\$pdfReg[\"" . substr($v, 2) . "\"]", $funcion->Expression);
                            }
                        }
                        $this->FunctionVuelo[$funcion->FieldName] = create_function('$pdfReg,$Fagre,$GenPdf,$obj=null', $funcion->Expression);
                    }
                }


                //$vv = preg_split("\$\$[A-Za-z]+\b" ,$funcion->Expression);
            }
        }
        //exit;
        //return;
        //----------------------------------------------------------------------
        $this->pageEstruc = (object) array();
        $this->pageEstruc->Type = $estruc->PageType->name;
        $this->pageEstruc->Orienta = $estruc->PageOrienta;
        $this->pageDocum = $estruc->Document;
        $marg = (object) array();
        $marg->Top = $estruc->MarginTop;
        $marg->Left = $estruc->MarginLeft;
        $marg->Bottom = $estruc->MarginBottom;
        $marg->Right = $estruc->MarginRight;

        //};
        //$this->pageEstruc->Margin = $estruc->Margin;
        $this->pageEstruc->Margin = $marg;
        $this->estruc = $estruc->Group;
        //----------------------------------------------------------------------
    }

    public function setValueGroup() {
        if (is_array($this->group)) {
            foreach ($this->group as $k => $v) {
                $this->groupAux[$k] = $this->reg[$k];
            }
        }
    }

    public function verificaGroup($group1) {
        if (is_object($this->RecordSet)) {
            $igual = true;
            $auxReg = $this->RecordSet->getRegistro(false);
            foreach ($group1 as $k => $v) {
                if ($this->groupAux[$v] != $auxReg[$v]) {
                    return false;
                }
            }
            return true;
        } else {
            $igual = true;
            foreach ($group1 as $k => $v) {
                if ($this->groupAux[$v] != $this->Data[$this->idata][$v]) {
                    return false;
                }
            }
            return true;
        }
    }

    public function nextData($retunData = true) {
        if (is_object($this->RecordSet)) {
            return $this->returnDataFromRecord($retunData);
        } else {
            return $this->returnDataFromArra($retunData);
        }
    }

    public function returnDataFromRecord($retunData) {
        $controGroup = false;
        if (is_array($this->group)) {
            $controGroup = true;
        }
        if ($this->dataEof == true)
            return false;

        if ($regAux = $this->RecordSet->next(false)) {
            if ($controGroup) {
                $this->groupIgual = true;
                if (is_array($this->groupAux)) {
                    foreach ($this->group as $k => $v) {
                        if ($this->groupAux[$k] != $regAux[$k]) { // $this->Data[$this->idata][$k]) {
                            $this->groupIgual = false;
                        }
                    }
                } else {
                    $this->groupAux = array();
                    foreach ($this->group as $k => $v) {
                        $this->groupAux[$k] = $this->reg[$k];
                    }
                }
            }
            if ($this->groupIgual) {
                $this->setRegistro();
            }
            if ($retunData) {
                return $this->reg;
            } else {
                return true;
            }
        } else {
            $this->dataEof = true;
            return false;
        }
    }

    private function returnDataFromArra($retunData) {
        $this->idata++;
        $controGroup = false;
        if (is_array($this->group)) {
            $controGroup = true;
        }
        if (isset($this->Data[$this->idata])) {
            if ($controGroup) {
                $this->groupIgual = true;
                if (is_array($this->groupAux)) {
                    foreach ($this->group as $k => $v) {
                        if ($this->groupAux[$k] != $this->Data[$this->idata][$k]) {
                            $this->groupIgual = false;
                        }
                    }
                } else {
                    foreach ($this->group as $k => $v) {
                        $this->groupAux[$k] = $this->reg[$k];
                    }
                }
            }
            if ($this->groupIgual) {
                $this->setRegistro();
            }
            if ($retunData) {
                return $this->reg;
            } else {
                return true;
            }
        } else {
            $this->dataEof = true;
            return false;
        }
    }

    public function getRegistro() {
        return $this->reg;
    }

    public function setRegistro() {
        if (is_object($this->RecordSet)) {
            $this->reg = $this->RecordSet->getRegistro(false);
        } else {
            $this->reg = $this->Data[$this->idata];
        }
    }

    public function isEof() {
        return $this->dataEof;
    }

    public function getHeadPage() {
        return $this->headPage;
    }

    public function setNameReportSal($name) {
        $this->NameReportSal = $name;
    }

    public function setDirRoot($name) {
        $this->dirRoot   = $name;
        if (is_null($this->dirSalida)){
            $this->dirSalida = $name;
        }
    }
    public function setDirSalida($name) {
        $this->dirSalida = $name;
    }

    public function getDirRoot() {
        return $this->dirRoot;
    }

    public function getMarginBottom() {
        return $this->pageEstruc->Margin->Bottom;
    }

    public function creo($data, $Escala = "mm",$usaTmpFile=false) {
         
       //----------------------------------------------------------------------
        $TipoHoja = $this->pageEstruc->Type;
        if (isset($this->pageEstruc->Orienta)) {
            $Orienta = $this->pageEstruc->Orienta;
        } else {
            $Orienta = "P";
        }
        $this->RecordSet = "";
        //----------------------------------------------------------------------
        if (is_array($data)) {
            $this->Data = $data;
        } else {
            $this->RecordSet = $data;
        }
        $v = $this->nextData();
        $this->headPage = new PhpGenPdfHead((object) $this->estruc->Header);
        $this->footerPage = new PhpGenPdfFooter((object) $this->estruc->Footer);
        //----------------------------------------------------------------------
        $this->pdf = new PhpGenPdfLibrary($Orienta, $Escala, $TipoHoja);
        $this->pdf->setIsUtf8($this->getIsUtf8());
        $this->pdf->SetMargins($this->pageEstruc->Margin->Left, $this->pageEstruc->Margin->Top, $this->pageEstruc->Margin->Right);		
        //----------------------------------------------------------------------
        $footerHeight = 0;
        foreach ($this->estruc->Footer->Items as $k => $v) {
            $footerHeight += $v->Height;
        }

        $this->pdf->SetAutoPageBreak(true, $footerHeight + $this->pageEstruc->Margin->Bottom);
        $this->pdf->SetCompression(false);
        $this->pdf->AliasNbPages();
        //----------------------------------------------------------------------
        $this->pdf->SetFont('Arial', 'B', 12);
        //----------------------------------------------------------------------
        $this->pdf->setPhpGenPdf($this->headPage, $this, $this->footerPage);
        //----------------------------------------------------------------------
        $this->pdf->AddPage();
        $hdoc = new PhpGenPdfHeadDocu($this->pageDocum->Header);
        $hdoc->write($this);
        $this->pdf->setDocumentHead();
        $this->pdf->Header();
        //----------------------------------------------------------------------
        $body = new PhpGenPdfBody((object) $this->estruc->Body);
        while ($this->isEof() == false) {
            $this->setValueGroup();
            $this->groupIgual = false;
            $body->genBody($this);
        }
        $fdoc = new PhpGenPdfFooterDocu($this->pageDocum->Footer);
        $fdoc->write($this);
        if ( self::$returnInBase64 == true ) {
            $aux = $this->pdf->Output("sale","s");
            //---------------------------------------------------------------------------------
            $this->pdf->Close();
            return base64_encode($aux);
        }else{
            //----------------------------------------------------------------------
            if ($usaTmpFile) {
                $sale = \TmpGen::getNameFile(usr_id, $this->nameReport, "pdf");
                $this->pdf->Output($sale->getFile(), "F");
                //---------------------------------------------------------------------------------
                $this->pdf->Close();
                //---------------------------------------------------------------------------------
                $this->fileSale = $sale->getInternet();
                //---------------------------------------------------------------------------------
                return $this->fileSale;

            }else{
                $nameY = date("U") . ".pdf";
                $file = $this->dirSalida . "tmp/" . $nameY;
                $this->pdf->Output($file, "F");
                //----------------------------------------------------------------------
                $this->pdf->Close();
                //----------------------------------------------------------------------
                $this->fileSale = $nameY; //$file; //$sale->getInternet();
                //----------------------------------------------------------------------
                return $this->fileSale;
            }
        }
    }
    /**
     * 
     * @param integer $height
     * @param array $listaItems
     * @return PageBreak
     */
    public function getNewPageBreak($height,$listaItems){
        return $this->pdf->getNewPageBreak($height,$listaItems);
    }
    
    public function setPageIfSaltSection($obj, $top, $left){
        return $this->pdf->setPageIfSaltSection($obj, $top, $left);
    }
    public function setPageIfSalt($obj, $top, $left){
        return $this->pdf->setPageIfSalt($obj, $top, $left);
    }
/*    public function veoSalto($pdf, $Height, $itemA) {
        $pdf->veoSalto($Height, $itemA);
    }

    public function saltoSet($obj, $pdf, $top, $left) {
        //----------------------------------------------------------------------
        $pdf->saltoSet($obj,  $top, $left);
        //----------------------------------------------------------------------
    }
*/
    protected function pdfFormat($obj, $f) {
        if (isset($obj->FormatType)) {
            if ($obj->FormatType == "Fecha") {
                if ($f == "") {
                    return "";
                }
                $a = date_create($f);
                $f = date_format($a, $obj->FormatMask);
            } else {
                if ($obj->FormatType == "Numero") {
                    if ($f == "") {
                        return "";
                    }
                    $f = number_format($f, $obj->FormatMask, ',', '.');
                }
            }
        }
        return $f;
    }

}

?>
