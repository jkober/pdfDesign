<?php

namespace Design\DesignBundle\Services\PdfExterno3;

class PhpGenPdfSections {
    use CrearFuncionTrait;
    protected $pdfSec = null;
    protected $tMargin = 0;
    protected $section = null;
    protected $itemsSection = null;
    protected $headHeight = null;

    public function getHeightHead() {
        return $this->headHeight;
    }

    /**
     * @return integer Setea la altura que tiene la ultima impresion del head y
     *                       si no tiene parametro la resetea para empezar a contar
     */
    public function setHeightHead($headHeight = 0) {
        $this->headHeight = $headHeight;
    }

    //--------------------------------------------------------------------------
    public function getHeight() {
        return $this->pdfSec->Items[$this->section->i]->Height;
    }

    protected function initialize() {
        //----------------------------------------------------------------------
        $this->section = (object) array();
        $this->section->i = -1;
        $this->section->cant = $this->pdfSec->ItemsCount - 1;
        //----------------------------------------------------------------------
        $this->itemsSection = (object) array();
        $this->itemsSection->i = null;
        $this->itemsSection->cant = null;
        //----------------------------------------------------------------------
    }

    protected function nextSection() {
        if (++$this->section->i > $this->section->cant) {
            $this->section->i = -1;
            $this->itemsSection->i = null;
            $this->itemsSection->cant = null;
            return false;
        }
        $this->itemsSection->i = -1;
        $this->itemsSection->cant = $this->pdfSec->Items[$this->section->i]->ItemsCount - 1;
        return true;
    }

    protected function isLast() {
        return $this->itemsSection->i == $this->itemsSection->cant;
    }

    protected function next() {
        if (++$this->itemsSection->i > $this->itemsSection->cant) {
            $this->itemsSection->i = null;
            $this->itemsSection->cant = null;
            return false;
        }
        return $this->pdfSec->Items[$this->section->i]->Items[$this->itemsSection->i];
    }

    protected function _writeFinish() {
        $obj = (object) array();
        $obj->PositionTop = $this->getHeight();
        $obj->PositionLeft = 0;
        return $obj;
    }

    protected function _write(PhpGenPdf $phpGen, $head = false, $headDocu = false) {
        if (!is_object($phpGen->objExtraSection)) {
            $phpGen->objExtraSection = (object) array();
        }
        //----------------------------------------------------------------------
        $heighH = 0;
        //----------------------------------------------------------------------
        $fpdf = $phpGen->getPdf();
//        $left       = $fpdf->lMargin;
        $marg = $fpdf->getMargins();
        $left = $marg["left"];
        $headPageOri = $fpdf->getPage();
        $reg = $phpGen->getRegistro();
        //----------------------------------------------------------------------
        while ($this->nextSection()) {
            if (!isset($this->pdfSec->Items[$this->section->i]->run)) {
                $this->pdfSec->Items[$this->section->i]->run = (object) array();
            }
            if (!isset($this->pdfSec->Items[$this->section->i]->run->brakBefore)) {
                if (trim($this->pdfSec->Items[$this->section->i]->PageBrakBefore->name) != "") {
                    $this->pdfSec->Items[$this->section->i]->run->brakBefore = self::create_function('$GenPdf,$pdfReg,$obj', $this->pdfSec->Items[$this->section->i]->PageBrakBefore->name);
                }
            }
            if (!isset($this->pdfSec->Items[$this->section->i]->run->brakAfter)) {
                if (trim($this->pdfSec->Items[$this->section->i]->PageBrakAfter->name) != "") {
                    $this->pdfSec->Items[$this->section->i]->run->brakAfter = self::create_function('$GenPdf,$pdfReg,$obj', $this->pdfSec->Items[$this->section->i]->PageBrakAfter->name);
                }
            }




            if (!isset($this->pdfSec->Items[$this->section->i]->ifPrint)) {
                if (trim($this->pdfSec->Items[$this->section->i]->PrintIf->name) != "") {
                    $this->pdfSec->Items[$this->section->i]->ifPrint = self::create_function('$GenPdf,$pdfReg,$obj', $this->pdfSec->Items[$this->section->i]->PrintIf->name);
                }
            }
            $print = false;
            if (isset($this->pdfSec->Items[$this->section->i]->ifPrint)) {
                $c = $this->pdfSec->Items[$this->section->i]->ifPrint;
                $print = $c($phpGen, $reg, $phpGen->objExtraSection);
            }
            if (!$print) {
                //--------------------------------------------------------------
                if ($head == false) {
                    if (isset($this->pdfSec->Items[$this->section->i]->run->brakBefore)) {
                        $f = $this->pdfSec->Items[$this->section->i]->run->brakBefore;
                        if ($f($phpGen, $reg, $phpGen->objExtraSection) == true) {
                            $fpdf->AddPage();
                        }
                    }
                }
                $top = $fpdf->getY();
                //--------------------------------------------------------------
                $pageOri = $fpdf->getPage();
                $pageUlt = $fpdf->getPage();
                //--------------------------------------------------------------
                $pageUltY = -1;
                $pageY = 0;
                $breakAux = $fpdf->getPageBreakTrigger();
                $pageBreak = $phpGen->getNewPageBreak($this->getHeight(), $this->pdfSec->Items[$this->section->i]->ItemsArrange);
                //--------------------------------------------------------------
                while ($obj = $this->next()) {
                    //----------------------------------------------------------
                    $fpdf->setPage($pageOri);
                    if ($pageBreak->isNew) {
                        $fpdf->setBreakPage($pageBreak->pageBreakNew);
                    }
                    $jjy = $fpdf->getY();
                    //----------------------------------------------------------
                    $h = 0;
                    //----------------------------------------------------------
                    $h = $phpGen->pdfPrintObject($obj, $top, $left);
                    //----------------------------------------------------------
                    if ($head == false) {
                        $aa = "";
                    }

                    if ($fpdf->getPage() > $pageUlt) {
                        $pageUlt = $fpdf->getPage();
                        $pageUltY = $fpdf->getY();
                    } else {
                        if ($fpdf->getPage() == $pageUlt) {
                            if ($fpdf->getY() > $pageUltY) {
                                $pageUltY = $fpdf->getY();
                            }
                        }
                    }
                }
                //--------------------------------------------------------------
                $fpdf->setPage($pageOri);
                //--------------------------------------------------------------
                $h = 0;
                //$auxY       = $fpdf->getY();
                //lo que hace es resetear a la ultima pagina en el ultimo Y
                //jajja
                //$phpGen->saltoSet($this->_writeFinish(), $fpdf, $top, $left);
                $phpGen->setPageIfSaltSection($this->_writeFinish(), $top, $left);

                if ($fpdf->getPage() > $pageUlt) {
                    $pageUlt = $fpdf->getPage();
                    $pageUltY = $fpdf->getY();
                } else {
                    if ($fpdf->getPage() == $pageUlt) {
                        if ($fpdf->getY() > $pageUltY) {
                            $pageUltY = $fpdf->getY();
                        }
                    }
                }


//                $aux=$this->_writeFinish();
                $fpdf->setPage($pageUlt);
                if ($pageUltY >= 0)
                    $fpdf->setY($pageUltY);


                //--------------------------------------------------------------
                $h = $fpdf->GetY();
                //--------------------------------------------------------------
                if ($head == false) {
                    $aa = "";
                }
                if ($pageUlt > $fpdf->getPage()) {
                    $fpdf->setPage($pageUlt);
                    $fpdf->setY($pageUltY);
                } else {
                    if ($fpdf->getPage() == $pageUlt) {
                        if ($fpdf->getY() >= $pageUltY) {
                            $fpdf->setY($fpdf->getY());
                        } else {
                            $fpdf->setY($pageUltY);
                        }
                    }
                }
                //--------------------------------------------------------------
                $fpdf->setBreakPage($pageBreak->pageBreakOld);
                //$fpdf->setPageBreakTrigger( $breakAux);
                //--------------------------------------------------------------
                if ($head == true) {
                    $heighH += $h;
                } else {
                    if (isset($this->pdfSec->Items[$this->section->i]->run->brakAfter)) {
                        $f = $this->pdfSec->Items[$this->section->i]->run->brakAfter;
                        if ($f($phpGen, $reg, $phpGen->objExtraSection) == true) {
                            if ($headDocu == true) {
                                if ($this->isLast()) {
                                    $fpdf->setDocumentHead();
                                }
                            }
                            $fpdf->AddPage();
                        }
                    }
                }
            }
            //------------------------------------------------------------------
            //------------------------------------------------------------------
        }
        if ($head == true) {
            //$headPageOri aca falta tener en cuenta esto
            $this->setHeightHead($heighH);
        }
    }

}

?>