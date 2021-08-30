<?php
namespace Design\DesignBundle\Services\PdfExterno3;
class PhpGenPdfBody extends PhpGenPdfSections {
    //--------------------------------------------------------------------------
    protected $gruposBody = "";
    //--------------------------------------------------------------------------
    public function getGroup() {
        return $this->gruposBody;
    }
    //--------------------------------------------------------------------------
//    public function phpGenPdfBody($body, $group=array()) {
    function __construct( $body, $group=array()) {
        $this->pdfSec = $body;
        if (!isset($this->pdfSec->Body)) {
            $this->initialize();
        } else {
            $this->gruposBody = $group;
            $this->gruposBody[] = $this->pdfSec->GroupBy;
        }
    }
    protected function groupBody(PhpGenPdf $phpGen) {
        //----------------------------------------------------------------------
        $head   = new PhpGenPdfHead((object) $this->pdfSec->Header);
        $phpGen->setGrupoIgual();
        $footer = new PhpGenPdfFooter((object) $this->pdfSec->Footer);
        //----------------------------------------------------------------------
        do {
            //------------------------------------------------------------------
            $phpGen->setValueGroup();
            //$head->setHeighGroupDesde($phpGen->getPdf()->getY());
            $head->writeHeadGrupo($phpGen);
            //------------------------------------------------------------------
            //------------------------------------------------------------------
            $body   = new PhpGenPdfBody((object) $this->pdfSec->Body, $this->getGroup());
            $body->genBody($phpGen);
            //------------------------------------------------------------------
            //------------------------------------------------------------------
            if ($phpGen->isEof()) {
                break;
            }
            //------------------------------------------------------------------
            if (!$phpGen->getGroupIgual()) {
                $i      = -1;
                $arra   = $this->getGroup();
                $migrupo= true;
                while (true) {
                    $i++;
                    if (isset($this->gruposBody[$i])) {
                        if (!$phpGen->verificaGroup($this->gruposBody[$i])) {
                            $i++;
                            if (isset($this->gruposBody[$i])) {
                                $migrupo = false;
                            }
                            break;
                        }
                    } else {
                        echo "error en estructura de lectura $i ";
                        break;
                    }
                }
                if ($migrupo) {
                    // aqui viene el pie
                    $phpGen->setRegistro();
                    $phpGen->setGrupoIgual();
                } else {
                    break;
                }
            }
            //------------------------------------------------------------------
            //------------------------------------------------------------------
            $footer->writeFooterGrupo($phpGen);
            //------------------------------------------------------------------
            //------------------------------------------------------------------
        } while ($phpGen->isEof() == false);
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $footer->writeFooterGrupo($phpGen);
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
    }
    protected function body(PhpGenPdf $phpGen) {
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $phpGen->setGrupoIgual();
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        do {
            //------------------------------------------------------------------
            if ($phpGen->getGroupIgual()) {
                //--------------------------------------------------------------
                //--------------------------------------------------------------
                $reg = $phpGen->getRegistro();
                //--------------------------------------------------------------
                foreach ($phpGen->getTotalField() as $k => $v) {
                    if ($v->TypeObj == "T") {
                        switch ($v->Type) {
                            case "Sum";
                                $phpGen->Fagre["{$v->FieldName}"] += $reg["{$v->FieldSummarize}"];
                                break;
                            case "TCount";
                            case "Count";
                                $phpGen->Fagre["{$v->FieldName}"]++;
                                break;
                            case "Avg";
                                $phpGen->Fagre["@{$v->FieldName}"]++;
                                $phpGen->Fagre["{$v->FieldName}"] +=$reg["{$v->FieldSummarize}"];
                                break;
                            case "TSum";
                                $phpGen->Fagre["{$v->FieldName}"] += $phpGen->FunctionVuelo[$v->FieldSummarize]($phpGen->getRegistro(), $phpGen->Fagre, $phpGen);
                                break;
                            case "TAvg";
                                $phpGen->Fagre["@{$v->FieldName}"]++;
                                $phpGen->Fagre["{$v->FieldName}"] += $phpGen->FunctionVuelo[$v->FieldSummarize]($phpGen->getRegistro(), $phpGen->Fagre, $phpGen);
                                break;
                        }
                    }
                }
                //--------------------------------------------------------------
                //--------------------------------------------------------------
                $this->write($phpGen);
                //--------------------------------------------------------------
                //--------------------------------------------------------------
            } else {
                //--------------------------------------------------------------
                break;
                //--------------------------------------------------------------
            }
        } while ($reg = $phpGen->nextData());
        //----------------------------------------------------------------------
    }
    public function genBody(PhpGenPdf $phpGen) {
        if (!isset($this->pdfSec->Body)) {
            $this->body($phpGen);
        } else {
            $this->groupBody($phpGen);
        }
    }
    //--------------------------------------------------------------------------
    /**
     * @param PhpGenPdf $phpGen
     */
    public function write(PhpGenPdf $phpGen) {
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $this->_write($phpGen); //----------------------------------------------
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
    }
}
?>